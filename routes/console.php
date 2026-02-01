<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule auto-completion of shipped orders
Schedule::command('complete:shipped-orders')->daily();

// Schedule auto-cancellation of expired orders
Schedule::command('cancel:expired-orders')->daily();
