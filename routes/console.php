<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Keep database active to prevent Aiven auto-pause
// This runs every 5 minutes to ensure the database stays active
Schedule::call(function () {
    try {
        // Perform a simple query to keep the database connection alive
        DB::select('SELECT 1');
        Log::info('Database keep-alive ping successful');
    } catch (\Exception $e) {
        Log::error('Database keep-alive ping failed: ' . $e->getMessage());
    }
})->everyFiveMinutes()
  ->name('database-keep-alive')
  ->withoutOverlapping()
  ->onOneServer();
