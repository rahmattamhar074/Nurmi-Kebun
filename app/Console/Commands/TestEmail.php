<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'mail:test {email? : The email address to send test email to}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Send a test email to verify Brevo SMTP configuration';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $email = $this->argument('email') ?? $this->ask('Enter the email address to send test email to');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $this->error('Invalid email address provided.');
      return Command::FAILURE;
    }

    $this->info('Sending test email to: ' . $email);
    $this->info('Using mailer: ' . config('mail.default'));
    $this->info('SMTP Host: ' . config('mail.mailers.smtp.host'));
    $this->info('SMTP Port: ' . config('mail.mailers.smtp.port'));
    $this->newLine();

    try {
      $timestamp = now()->format('Y-m-d H:i:s T');
      $emailBody = "This is a test email from your Laravel application using Brevo SMTP.\n\n";
      $emailBody .= "If you receive this, your email configuration is working correctly!\n\n";
      $emailBody .= "---\n";
      $emailBody .= "Sent at: {$timestamp}\n";
      $emailBody .= "Server timezone: " . config('app.timezone') . "\n";

      Mail::raw($emailBody, function ($message) use ($email) {
        $message->to($email)
          ->subject('Test Email - Brevo SMTP Configuration');
      });

      $this->info('✅ Test email sent successfully!');
      $this->info('Check your inbox (and spam folder) at: ' . $email);
      $this->newLine();
      $this->warn('If you don\'t receive the email:');
      $this->line('1. Check Brevo dashboard for delivery logs');
      $this->line('2. Verify your domain authentication status');
      $this->line('3. Check storage/logs/laravel.log for errors');

      return Command::SUCCESS;
    } catch (\Exception $e) {
      $this->error('❌ Failed to send test email.');
      $this->error('Error: ' . $e->getMessage());
      $this->newLine();
      $this->error('Full error trace:');
      $this->line($e->getTraceAsString());

      $this->newLine();
      $this->warn('Common issues:');
      $this->line('1. Check your MAIL_USERNAME and MAIL_PASSWORD in .env');
      $this->line('2. Ensure MAIL_FROM_ADDRESS is from your verified domain');
      $this->line('3. Verify your Brevo SMTP API key is correct');
      $this->line('4. Check if your domain is authenticated in Brevo');

      return Command::FAILURE;
    }
  }
}
