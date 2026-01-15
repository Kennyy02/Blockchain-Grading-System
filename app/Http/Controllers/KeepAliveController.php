<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class KeepAliveController extends Controller
{
    /**
     * Keep-alive endpoint to prevent Render from sleeping
     * This endpoint can be pinged by external services like UptimeRobot
     */
    public function ping()
    {
        try {
            // Perform a simple database query to keep Aiven database active
            DB::select('SELECT 1');
            
            return response()->json([
                'status' => 'ok',
                'timestamp' => now()->toIso8601String(),
                'database' => 'connected',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'timestamp' => now()->toIso8601String(),
                'database' => 'disconnected',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Health check endpoint (also keeps services alive)
     */
    public function health()
    {
        try {
            // Check database connection
            DB::connection()->getPdo();
            
            // Test cache
            $cacheStatus = 'available';
            try {
                Cache::put('health_check', 'ok', 1);
                $cacheStatus = Cache::get('health_check') === 'ok' ? 'connected' : 'available';
            } catch (\Exception $e) {
                $cacheStatus = 'error';
            }
            
            return response()->json([
                'status' => 'healthy',
                'timestamp' => now()->toIso8601String(),
                'services' => [
                    'database' => 'connected',
                    'cache' => $cacheStatus,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'unhealthy',
                'timestamp' => now()->toIso8601String(),
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}

