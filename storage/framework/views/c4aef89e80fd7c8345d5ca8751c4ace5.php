<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>" />

    
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#FF5A36" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="TOYS 141" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Baloo+Bhaijaan+2:wght@500;600;700;800&display=swap" rel="stylesheet">
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>

    <?php if (! (app()->environment('local'))): ?>
    <script nonce="<?php echo e(app('csp-nonce')); ?>">
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }
    </script>
    <?php endif; ?>
</head>
<body class="font-cairo bg-cream text-ink antialiased">
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } ?>
</body>
</html>
<?php /**PATH C:\laragon\www\toys141-app\resources\views/app.blade.php ENDPATH**/ ?>