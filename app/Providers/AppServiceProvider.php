<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // تسجيل الدخول — 5 محاولات/دقيقة per IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // إرسال طلب — 10 طلبات/ساعة per IP (يمنع الـ spam)
        RateLimiter::for('orders', function (Request $request) {
            return Limit::perHour(10)->by($request->ip());
        });

        // محادثة AI — 20 رسالة/ساعة per IP (يمنع استنزاف الـ API key)
        RateLimiter::for('ai-chat', function (Request $request) {
            return Limit::perHour(20)->by($request->ip());
        });

        // تسجيل مستخدم جديد — 5 مرات/ساعة per IP
        RateLimiter::for('register', function (Request $request) {
            return Limit::perHour(5)->by($request->ip());
        });
    }
}
