<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - {{ $order->order_number }}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      font-size: 12px;
      color: #333;
      padding: 30px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #333;
      padding-bottom: 20px;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 5px;
      color: #000;
    }

    .header .company-name {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }

    .invoice-info {
      display: table;
      width: 100%;
      margin-bottom: 30px;
    }

    .invoice-info-left,
    .invoice-info-right {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }

    .invoice-info-right {
      text-align: right;
    }

    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
      margin-top: 10px;
    }

    .status-paid {
      background-color: #dbeafe;
      color: #1e40af;
      border: 2px solid #3b82f6;
    }

    .status-completed {
      background-color: #d1fae5;
      color: #065f46;
      border: 2px solid #10b981;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #000;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .info-row {
      margin-bottom: 5px;
      line-height: 1.6;
    }

    .info-label {
      display: inline-block;
      width: 140px;
      font-weight: bold;
      color: #555;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    table thead {
      background-color: #f5f5f5;
    }

    table th {
      padding: 12px 8px;
      text-align: left;
      border: 1px solid #ddd;
      font-weight: bold;
      font-size: 12px;
    }

    table td {
      padding: 10px 8px;
      border: 1px solid #ddd;
      font-size: 12px;
    }

    table tbody tr:nth-child(even) {
      background-color: #fafafa;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .totals {
      margin-top: 20px;
      float: right;
      width: 300px;
    }

    .totals-row {
      display: table;
      width: 100%;
      margin-bottom: 8px;
    }

    .totals-label {
      display: table-cell;
      text-align: right;
      padding-right: 15px;
      font-weight: bold;
    }

    .totals-value {
      display: table-cell;
      text-align: right;
      width: 120px;
    }

    .totals-row.grand-total {
      border-top: 2px solid #333;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 14px;
      font-weight: bold;
    }

    .gratitude {
      clear: both;
      margin-top: 40px;
      padding: 20px;
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 4px;
      text-align: center;
    }

    .gratitude h3 {
      color: #166534;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .gratitude p {
      color: #15803d;
      line-height: 1.6;
    }

    .footer {
      clear: both;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 10px;
      color: #999;
    }

    .clearfix::after {
      content: "";
      display: table;
      clear: both;
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="company-name">Nurmi Kebun</div>
    <h1>INVOICE</h1>
    <div style="margin-top: 10px;">
      <strong>Invoice Number:</strong> {{ $order->order_number }}
    </div>
    @if($order->status === 'completed')
    <div class="status-badge status-completed">COMPLETED</div>
    @else
    <div class="status-badge status-paid">PAID</div>
    @endif
  </div>

  <div class="invoice-info">
    <div class="invoice-info-left">
      <div class="info-row">
        <span class="info-label">Order Date:</span>
        {{ $order->created_at->format('d F Y') }}
      </div>
      @if($order->payment_verified_at)
      <div class="info-row">
        <span class="info-label">Payment Verified:</span>
        {{ $order->payment_verified_at->format('d F Y H:i') }}
      </div>
      @endif
      @if($order->status === 'completed' && $order->completed_at)
      <div class="info-row">
        <span class="info-label">Completed:</span>
        {{ $order->completed_at->format('d F Y H:i') }}
      </div>
      @endif
    </div>
    <div class="invoice-info-right">
      <div class="info-row">
        <strong>Customer:</strong> {{ $order->user->name }}
      </div>
      <div class="info-row">
        {{ $order->user->email }}
      </div>
      <div class="info-row">
        {{ $order->contact_phone }}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Shipping Address</div>
    <div class="info-row">{{ $order->recipient_name }}</div>
    <div class="info-row">{{ $order->recipient_phone }}</div>
    <div class="info-row">{{ $order->full_address }}</div>
    <div class="info-row">
      {{ $order->subdistrict_name ? $order->subdistrict_name . ', ' : '' }}{{ $order->city_name }}, {{ $order->province_name }} {{ $order->postal_code }}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Payment Method</div>
    <div class="info-row">
      <span class="info-label">Method:</span>
      {{ $order->payment_method_name }}
    </div>
    @if($order->payment_method_type === 'bank_transfer')
    <div class="info-row">
      <span class="info-label">Account Number:</span>
      {{ $order->payment_account_number }}
    </div>
    <div class="info-row">
      <span class="info-label">Account Holder:</span>
      {{ $order->payment_account_holder }}
    </div>
    @endif
  </div>

  <div class="section">
    <div class="section-title">Order Items</div>
    <table>
      <thead>
        <tr>
          <th style="width: 50px;" class="text-center">No</th>
          <th>Product</th>
          <th style="width: 80px;" class="text-center">Quantity</th>
          <th style="width: 120px;" class="text-right">Unit Price</th>
          <th style="width: 120px;" class="text-right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $index => $item)
        <tr>
          <td class="text-center">{{ $index + 1 }}</td>
          <td>
            <strong>{{ $item->product_name }}</strong><br>
            <small style="color: #666;">{{ $item->product_code }}</small>
          </td>
          <td class="text-center">{{ $item->quantity }}</td>
          <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
          <td class="text-right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <div class="clearfix">
      <div class="totals">
        <div class="totals-row">
          <div class="totals-label">Subtotal:</div>
          <div class="totals-value">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</div>
        </div>
        <div class="totals-row">
          <div class="totals-label">Shipping Cost:</div>
          <div class="totals-value">Rp {{ number_format($order->shipping_cost, 0, ',', '.') }}</div>
        </div>
        <div class="totals-row grand-total">
          <div class="totals-label">TOTAL:</div>
          <div class="totals-value">Rp {{ number_format($order->total, 0, ',', '.') }}</div>
        </div>
      </div>
    </div>
  </div>

  @if($order->status === 'completed')
  <div class="gratitude">
    <h3>Thank You for Your Purchase!</h3>
    <p>
      We appreciate your business and hope you enjoy your products.<br>
      If you have any questions or concerns, please don't hesitate to contact us.
    </p>
  </div>
  @endif

  <div class="footer">
    <p>This is a computer-generated invoice and does not require a signature.</p>
    <p>Generated on {{ now()->format('d F Y H:i:s') }}</p>
    <p>&copy; {{ now()->year }} Nurmi Kebun. All rights reserved.</p>
  </div>
</body>

</html>