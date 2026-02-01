<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Exports\ReportsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * Display completed transactions report
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'completed_at');
        $direction = $request->input('direction', 'desc');

        $query = Order::query()
            ->where('status', 'completed')
            ->with(['user', 'items.product', 'paymentMethod']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $allowedSorts = ['order_number', 'total', 'completed_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction);
        } else {
            $query->orderBy('completed_at', 'desc');
        }

        $orders = $query->paginate(10);

        return Inertia::render('dashboard/reports/page', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    /**
     * Export completed transactions to Excel
     */
    public function exportExcel(Request $request)
    {
        $validated = $request->validate([
            'period' => 'nullable|string',
            'start_date' => 'nullable|date|required_with:end_date',
            'end_date' => 'nullable|date|required_with:start_date|after_or_equal:start_date',
        ]);

        if (isset($validated['start_date']) && isset($validated['end_date'])) {
            $start = \Carbon\Carbon::parse($validated['start_date']);
            $end = \Carbon\Carbon::parse($validated['end_date']);

            if ($start->diffInDays($end) > 30) {
                return back()->with('error', 'Date range cannot exceed 30 days.');
            }
        }

        $orders = $this->getFilteredQuery($validated);

        $filename = 'reports-' . $this->generateFilename($validated) . '.xlsx';

        return Excel::download(new ReportsExport($orders), $filename);
    }

    /**
     * Export completed transactions to PDF
     */
    public function exportPdf(Request $request)
    {
        $validated = $request->validate([
            'period' => 'nullable|string',
            'start_date' => 'nullable|date|required_with:end_date',
            'end_date' => 'nullable|date|required_with:start_date|after_or_equal:start_date',
        ]);

        if (isset($validated['start_date']) && isset($validated['end_date'])) {
            $start = \Carbon\Carbon::parse($validated['start_date']);
            $end = \Carbon\Carbon::parse($validated['end_date']);

            if ($start->diffInDays($end) > 30) {
                return back()->with('error', 'Date range cannot exceed 30 days.');
            }
        }

        $orders = $this->getFilteredQuery($validated);

        $summary = [
            'total_orders' => $orders->count(),
            'total_revenue' => $orders->sum('total'),
        ];

        $periodLabel = $this->generatePeriodLabel($validated);

        $filename = 'reports-' . $this->generateFilename($validated) . '.pdf';

        $pdf = Pdf::loadView('reports.reports-pdf', [
            'orders' => $orders,
            'summary' => $summary,
            'periodLabel' => $periodLabel,
        ]);

        return $pdf->download($filename);
    }

    /**
     * Get filtered query based on period or date range
     */
    private function getFilteredQuery(array $filters)
    {
        $query = Order::query()
            ->where('status', 'completed')
            ->with(['user', 'items.product', 'paymentMethod']);

        if (isset($filters['period']) && $filters['period']) {
            $date = \Carbon\Carbon::parse($filters['period'] . '-01');
            $query->whereYear('completed_at', $date->year)
                ->whereMonth('completed_at', $date->month);
        } elseif (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->whereBetween('completed_at', [
                $filters['start_date'],
                $filters['end_date'] . ' 23:59:59',
            ]);
        }

        return $query->orderBy('completed_at', 'desc')->get();
    }

    /**
     * Generate filename based on period or date range
     */
    private function generateFilename(array $filters): string
    {
        if (isset($filters['period']) && $filters['period']) {
            return str_replace('-', '', $filters['period']);
        } elseif (isset($filters['start_date']) && isset($filters['end_date'])) {
            return $filters['start_date'] . '_to_' . $filters['end_date'];
        }

        return date('Y-m-d');
    }

    /**
     * Generate human-readable period label
     */
    private function generatePeriodLabel(array $filters): string
    {
        if (isset($filters['period']) && $filters['period']) {
            $date = \Carbon\Carbon::parse($filters['period'] . '-01');
            return $date->format('F Y');
        } elseif (isset($filters['start_date']) && isset($filters['end_date'])) {
            return $filters['start_date'] . ' to ' . $filters['end_date'];
        }

        return 'All Time';
    }
}
