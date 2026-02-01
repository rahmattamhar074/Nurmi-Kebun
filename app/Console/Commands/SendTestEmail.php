<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification as BaseNotification;

class SendTestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email} {--type=test : Type of email to send (test, reset, verify, invoice)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify email templates and styling';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $type = $this->option('type');

        $this->info("Sending {$type} email to: {$email}");

        try {
            switch ($type) {
                case 'reset':
                    $this->sendPasswordResetEmail($email);
                    break;
                case 'verify':
                    $this->sendVerificationEmail($email);
                    break;
                case 'invoice':
                    $this->sendInvoiceEmail($email);
                    break;
                case 'test':
                default:
                    $this->sendTestEmail($email);
                    break;
            }

            $this->info('✓ Email sent successfully!');
            $this->newLine();
            $this->info('Check your email inbox (and spam folder) for the test email.');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Send a test email with all button types
     */
    private function sendTestEmail(string $email)
    {
        Notification::route('mail', $email)->notify(new class extends BaseNotification {
            public function via($notifiable)
            {
                return ['mail'];
            }

            public function toMail($notifiable)
            {
                return (new MailMessage)
                    ->subject('Test Email - ' . config('app.name'))
                    ->greeting('Hello!')
                    ->line('This is a test email to verify your email templates are working correctly.')
                    ->line('Below you can see different button styles:')
                    ->action('Primary Button', url('/'))
                    ->line('This email demonstrates the primary button style.')
                    ->line('Thank you for using ' . config('app.name') . '!');
            }
        });
    }

    /**
     * Send a password reset test email
     */
    private function sendPasswordResetEmail(string $email)
    {
        // Create a temporary user or use existing
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->warn('User not found. Creating a temporary notification...');
            Notification::route('mail', $email)->notify(new ResetPasswordNotification('test-token-' . bin2hex(random_bytes(16))));
        } else {
            $user->notify(new ResetPasswordNotification('test-token-' . bin2hex(random_bytes(16))));
        }
    }

    /**
     * Send an email verification test
     */
    private function sendVerificationEmail(string $email)
    {
        Notification::route('mail', $email)->notify(new class extends BaseNotification {
            public function via($notifiable)
            {
                return ['mail'];
            }

            public function toMail($notifiable)
            {
                return (new MailMessage)
                    ->subject('Verify Email Address')
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email Address', url('/verify-email'))
                    ->line('If you did not create an account, no further action is required.');
            }
        });
    }

    /**
     * Send an invoice test email
     */
    private function sendInvoiceEmail(string $email)
    {
        $this->info('Generating dummy order data...');
        $order = $this->createDummyOrder($email);

        $this->info('Generating PDF invoice...');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.invoice', ['order' => $order]);

        $this->info('Attaching PDF to email...');
        Notification::route('mail', $email)->notify(new class($pdf, $order) extends BaseNotification {
            protected $pdf;
            protected $order;

            public function __construct($pdf, $order)
            {
                $this->pdf = $pdf;
                $this->order = $order;
            }

            public function via($notifiable)
            {
                return ['mail'];
            }

            public function toMail($notifiable)
            {
                return (new MailMessage)
                    ->subject('Invoice #' . $this->order->order_number . ' - ' . config('app.name'))
                    ->greeting('Hello ' . $this->order->user->name . '!')
                    ->line('Thank you for your purchase. Please find your invoice attached below.')
                    ->line('Order Number: ' . $this->order->order_number)
                    ->line('Total: Rp ' . number_format($this->order->total, 0, ',', '.'))
                    ->action('View Order', url('/dashboard/orders/' . $this->order->order_number))
                    ->attachData($this->pdf->output(), 'invoice-' . $this->order->order_number . '.pdf', [
                        'mime' => 'application/pdf',
                    ])
                    ->line('Thank you for shopping with us!');
            }
        });
    }

    /**
     * Create a dummy order object for testing
     */
    private function createDummyOrder(string $email)
    {
        // Mock User
        $user = new \stdClass();
        $user->name = 'Test User';
        $user->email = $email;

        // Mock Order Items
        $items = collect([
            (object)[
                'product_name' => 'Monstera Variegata',
                'product_code' => 'PLT-001',
                'quantity' => 1,
                'price' => 1500000,
                'subtotal' => 1500000,
            ],
            (object)[
                'product_name' => 'Pot Terracotta D20',
                'product_code' => 'POT-023',
                'quantity' => 2,
                'price' => 25000,
                'subtotal' => 50000,
            ],
            (object)[
                'product_name' => 'Media Tanam Premium 1kg',
                'product_code' => 'MED-005',
                'quantity' => 3,
                'price' => 15000,
                'subtotal' => 45000,
            ]
        ]);

        // Mock Order
        $order = new \stdClass();
        $order->order_number = 'ORD-' . date('Ymd') . '-' . rand(1000, 9999);
        $order->status = 'completed';
        $order->created_at = now();
        $order->payment_verified_at = now()->subHours(2);
        $order->completed_at = now()->subHour();
        $order->user = $user;
        $order->contact_phone = '0812-3456-7890';

        $order->recipient_name = $user->name;
        $order->recipient_phone = '0812-3456-7890';
        $order->full_address = 'Jl. Bunga Melati No. 123, Komplek Asri';
        $order->subdistrict_name = 'Cilandak';
        $order->city_name = 'Jakarta Selatan';
        $order->province_name = 'DKI Jakarta';
        $order->postal_code = '12430';

        $order->payment_method_name = 'Bank Transfer - BCA';
        $order->payment_method_type = 'bank_transfer';
        $order->payment_account_number = '1234567890';
        $order->payment_account_holder = 'PT Nurmi Kebun';

        $order->items = $items;
        $order->subtotal = 1595000;
        $order->shipping_cost = 25000;
        $order->total = 1620000;

        return $order;
    }
}
