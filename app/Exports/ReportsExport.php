<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
  protected Collection $orders;

  public function __construct(Collection $orders)
  {
    $this->orders = $orders;
  }

  /**
   * @return Collection
   */
  public function collection(): Collection
  {
    return $this->orders;
  }

  /**
   * @return array
   */
  public function headings(): array
  {
    return [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Total Amount',
      'Payment Method',
      'Completed At',
    ];
  }

  /**
   * @param mixed $order
   * @return array
   */
  public function map($order): array
  {
    return [
      $order->order_number,
      $order->user->name ?? 'N/A',
      $order->user->email ?? 'N/A',
      'Rp ' . number_format($order->total, 0, ',', '.'),
      $order->paymentMethod->name ?? 'N/A',
      $order->completed_at ? $order->completed_at->format('Y-m-d H:i:s') : 'N/A',
    ];
  }

  /**
   * @param Worksheet $sheet
   * @return array
   */
  public function styles(Worksheet $sheet): array
  {
    return [
      1 => ['font' => ['bold' => true]],
    ];
  }

  /**
   * @return array
   */
  public function columnWidths(): array
  {
    return [
      'A' => 20,
      'B' => 25,
      'C' => 30,
      'D' => 20,
      'E' => 20,
      'F' => 20,
    ];
  }
}
