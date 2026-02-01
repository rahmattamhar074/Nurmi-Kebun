<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckMailConfig extends Command
{
  protected $signature = 'mail:check-config';
  protected $description = 'Check current mail configuration';

  public function handle()
  {
    $this->info('=== Mail Configuration Check ===');
    $this->newLine();

    $this->table(
      ['Config Key', 'Value'],
      [
        ['MAIL_MAILER (env)', env('MAIL_MAILER', 'NOT SET')],
        ['mail.default (config)', config('mail.default')],
        ['MAIL_HOST (env)', env('MAIL_HOST', 'NOT SET')],
        ['mail.mailers.smtp.host', config('mail.mailers.smtp.host')],
        ['MAIL_PORT (env)', env('MAIL_PORT', 'NOT SET')],
        ['mail.mailers.smtp.port', config('mail.mailers.smtp.port')],
        ['MAIL_USERNAME (env)', env('MAIL_USERNAME', 'NOT SET')],
        ['mail.mailers.smtp.username', config('mail.mailers.smtp.username')],
        ['MAIL_FROM_ADDRESS (env)', env('MAIL_FROM_ADDRESS', 'NOT SET')],
        ['mail.from.address', config('mail.from.address')],
      ]
    );

    $this->newLine();

    if (config('mail.default') !== 'smtp') {
      $this->error('❌ Mail driver is NOT set to SMTP!');
      $this->warn('Current driver: ' . config('mail.default'));
      $this->newLine();
      $this->info('To fix this:');
      $this->line('1. Make sure your .env file has: MAIL_MAILER=smtp');
      $this->line('2. Run: php artisan config:clear');
      $this->line('3. Run this command again to verify');
    } else {
      $this->info('✅ Mail driver is correctly set to SMTP');
    }

    return Command::SUCCESS;
  }
}
