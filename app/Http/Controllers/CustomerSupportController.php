<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTicketRequest;
use App\Http\Requests\ReplyTicketRequest;
use App\Models\SupportTicket;
use App\Models\SupportMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class CustomerSupportController extends Controller
{
    /**
     * Redirect to active tickets page
     */
    public function index()
    {
        return redirect()->route('support.active');
    }

    /**
     * Display active tickets
     */
    public function active(Request $request): Response
    {
        $tickets = SupportTicket::query()
            ->where('user_id', $request->user()->id)
            ->active()
            ->with(['order'])
            ->orderBy('last_reply_at', 'desc')
            ->paginate(10);

        return Inertia::render('support/active/page', [
            'tickets' => $tickets->items(),
            'pagination' => [
                'currentPage' => $tickets->currentPage(),
                'totalPages' => $tickets->lastPage(),
                'perPage' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem() ?? 0,
                'to' => $tickets->lastItem() ?? 0,
            ],
        ]);
    }

    /**
     * Display resolved tickets
     */
    public function resolved(Request $request): Response
    {
        $tickets = SupportTicket::query()
            ->where('user_id', $request->user()->id)
            ->resolved()
            ->with(['order'])
            ->orderBy('resolved_at', 'desc')
            ->paginate(10);

        return Inertia::render('support/resolved/page', [
            'tickets' => $tickets->items(),
            'pagination' => [
                'currentPage' => $tickets->currentPage(),
                'totalPages' => $tickets->lastPage(),
                'perPage' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem() ?? 0,
                'to' => $tickets->lastItem() ?? 0,
            ],
        ]);
    }

    /**
     * Display closed tickets
     */
    public function closed(Request $request): Response
    {
        $tickets = SupportTicket::query()
            ->where('user_id', $request->user()->id)
            ->closed()
            ->with(['order'])
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('support/closed/page', [
            'tickets' => $tickets->items(),
            'pagination' => [
                'currentPage' => $tickets->currentPage(),
                'totalPages' => $tickets->lastPage(),
                'perPage' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem() ?? 0,
                'to' => $tickets->lastItem() ?? 0,
            ],
        ]);
    }

    /**
     * Show ticket detail
     */
    public function show(Request $request, SupportTicket $ticket): Response
    {
        // Verify user owns the ticket
        if ($ticket->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        $ticket->load(['order', 'messages.user']);

        return Inertia::render('support/[ticket]/page', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Create a new ticket
     */
    public function store(CreateTicketRequest $request)
    {
        $validated = $request->validated();

        // Create ticket
        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'order_id' => $validated['order_id'] ?? null,
            'subject' => $validated['subject'],
            'status' => 'active',
            'last_reply_at' => now(),
            'last_reply_by' => 'customer',
        ]);

        // Handle file upload
        $attachmentPath = null;
        $attachmentName = null;
        $attachmentSize = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $attachmentName = $file->getClientOriginalName();
            $attachmentSize = $file->getSize();
            $attachmentPath = $file->store("support-attachments/{$ticket->id}");
        }

        // Create initial message
        SupportMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachmentName,
            'attachment_size' => $attachmentSize,
            'is_admin_reply' => false,
        ]);

        return redirect()->route('support.show', $ticket->ticket_number)
            ->with('success', 'Support ticket created successfully!');
    }

    /**
     * Reply to a ticket
     */
    public function reply(ReplyTicketRequest $request, SupportTicket $ticket)
    {
        // Verify user owns the ticket
        if ($ticket->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        if (!$ticket->canCustomerReply()) {
            return back()->with('error', 'You cannot reply to this ticket at this time.');
        }

        $validated = $request->validated();

        // Handle file upload
        $attachmentPath = null;
        $attachmentName = null;
        $attachmentSize = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $attachmentName = $file->getClientOriginalName();
            $attachmentSize = $file->getSize();
            $attachmentPath = $file->store("support-attachments/{$ticket->id}");
        }

        // Create message
        SupportMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachmentName,
            'attachment_size' => $attachmentSize,
            'is_admin_reply' => false,
        ]);

        // Update ticket
        $ticket->update([
            'last_reply_at' => now(),
            'last_reply_by' => 'customer',
        ]);

        return back()->with('success', 'Reply sent successfully!');
    }

    /**
     * Close a ticket
     */
    public function close(Request $request, SupportTicket $ticket)
    {
        // Verify user owns the ticket
        if ($ticket->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this ticket.');
        }

        $ticket->update(['status' => 'closed']);

        return back()->with('success', 'Ticket closed successfully!');
    }

    /**
     * Download attachment
     */
    public function downloadAttachment(Request $request, SupportMessage $message)
    {
        // Verify user owns the ticket
        $ticket = $message->ticket;
        if ($ticket->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this attachment.');
        }

        if (!$message->hasAttachment()) {
            abort(404, 'Attachment not found.');
        }

        // Try private disk first (admin uploads), then public disk (customer uploads)
        if (Storage::exists($message->attachment_path)) {
            return Storage::download(
                $message->attachment_path,
                $message->attachment_name
            );
        } elseif (Storage::disk('public')->exists($message->attachment_path)) {
            return Storage::disk('public')->download(
                $message->attachment_path,
                $message->attachment_name
            );
        }

        abort(404, 'Attachment file not found.');
    }
}
