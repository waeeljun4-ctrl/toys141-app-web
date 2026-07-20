<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // نولّد nonce عشوائي لكل طلب — يُستخدم في CSP وفي الـ blade
        $nonce = base64_encode(random_bytes(16));
        app()->instance('csp-nonce', $nonce);

        // منخلي Vite يحط نفس الـ nonce تلقائياً على كل سكربتاته (بما فيها
        // سكربت الـ inline الخاص بـ @viteReactRefresh) — بدونها CSP كانت
        // تمنع تنفيذه لأنه inline بدون nonce، فينهار تحميل React بالكامل
        Vite::useCspNonce($nonce);

        $response = $next($request);

        // ── Content-Security-Policy ──────────────────────────────────────
        // script-src: فقط ملفات 'self' + السكريبت الـ inline المحدد بالـ nonce
        // style-src:  'unsafe-inline' ضروري لـ Tailwind + Google Fonts
        // frame-src:  YouTube للفيديوهات المدمجة في الأدمن
        // في local: نسمح بسيرفر Vite (127.0.0.1:5173 + ws) لأن سكريبتات
        // @viteReactRefresh / @vite بوضع dev بتيجي من origin مختلف بدون nonce
        $viteDevOrigins = app()->environment('local') ? ' http://127.0.0.1:5173 ws://127.0.0.1:5173' : '';

        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'nonce-{$nonce}'{$viteDevOrigins}",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com{$viteDevOrigins}",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: blob:",
            "media-src 'self' blob:",
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
            "connect-src 'self' ws: wss:{$viteDevOrigins}",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);

        $response->headers->set('Content-Security-Policy', $csp);

        // ── Headers أساسية ──────────────────────────────────────────────
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        // في local: ما منحط X-Frame-Options عشان يشتغل جوا Simple Browser
        // بالـ VSCode (هو نفسه بيحمّل الصفحة جوا iframe من origin مختلف)
        if (! app()->environment('local')) {
            $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        }
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // نشيل معلومات السيرفر
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
