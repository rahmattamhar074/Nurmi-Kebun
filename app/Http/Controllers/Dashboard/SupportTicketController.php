<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReplyTicketRequest;
use App\Models\SupportTicket;
use App\Models\SupportMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class SupportTicketController extends Controller
{
    /**
     * Display all support tickets with filters
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = SupportTicket::query()
            ->with(['user', 'order'])
            ->orderBy('last_reply_at', 'desc');

        if ($status && in_array($status, ['active', 'resolved', 'closed'])) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $tickets = $query->paginate(15);

        return Inertia::render('dashboard/support/index', [
            'tickets' => $tickets->items(),
            'pagination' => [
                'currentPage' => $tickets->currentPage(),
                'totalPages' => $tickets->lastPage(),
                'perPage' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem() ?? 0,
                'to' => $tickets->lastItem() ?? 0,
            ],
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display a specific ticket with conversation
     */
    public function show(SupportTicket $ticket): Response
    {
        $ticket->load(['user', 'order', 'messages.user']);

        return Inertia::render('dashboard/support/[ticket]/page', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Reply to a ticket (admin)
     */
    public function reply(ReplyTicketRequest $request, SupportTicket $ticket)
    {
        if (!$ticket->canAdminReply()) {
            return back()->with('error', 'Cannot reply to this ticket.');
        }

        $validated = $request->validated();

        $attachmentPath = null;
        $attachmentName = null;
        $attachmentSize = null;

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $attachmentName = $file->getClientOriginalName();
            $attachmentSize = $file->getSize();
            $attachmentPath = $file->store("support-attachments/{$ticket->id}");
        }

        SupportMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachmentName,
            'attachment_size' => $attachmentSize,
            'is_admin_reply' => true,
        ]);

        $ticket->update([
            'last_reply_at' => now(),
            'last_reply_by' => 'admin',
        ]);

        return back()->with('success', 'Reply sent successfully!');
    }

    /**
     * Mark ticket as resolved
     */
    public function markAsResolved(SupportTicket $ticket)
    {
        $ticket->markAsResolved(auth()->id());

        return back()->with('success', 'Ticket marked as resolved!');
    }

    /**
     * Close a ticket
     */
    public function close(SupportTicket $ticket)
    {
        $ticket->update(['status' => 'closed']);

        return back()->with('success', 'Ticket closed successfully!');
    }

    /**
     * Download attachment
     */
    public function downloadAttachment(SupportMessage $message)
    {
        if (!$message->hasAttachment()) {
            abort(404, 'Attachment not found.');
        }

        return Storage::download(
            $message->attachment_path,
            $message->attachment_name
        );
    }
}
