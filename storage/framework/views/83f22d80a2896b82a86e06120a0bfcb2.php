<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo e($title); ?> — TOYS 141</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --ink: #1F1B16;
            --cream: #F5F1EA;
            --cream2: #EDE6D8;
            --primary: #B67D62;
            --muted: #8A8072;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Cairo', sans-serif;
            background: var(--cream);
            color: var(--ink);
            margin: 0;
            line-height: 1.9;
        }
        header {
            background: var(--ink);
            color: #fff;
            padding: 28px 20px;
            text-align: center;
        }
        header h1 { margin: 0; font-size: 20px; font-weight: 900; }
        header p { margin: 6px 0 0; color: #9CA3AF; font-size: 13px; }
        main {
            max-width: 720px;
            margin: 0 auto;
            padding: 32px 20px 60px;
        }
        .card {
            background: #fff;
            border: 1px solid var(--cream2);
            border-radius: 16px;
            padding: 28px 24px;
        }
        h2 {
            font-size: 17px;
            font-weight: 700;
            margin: 28px 0 10px;
            color: var(--primary);
        }
        h2:first-child { margin-top: 0; }
        p, li { font-size: 14.5px; color: #374151; }
        ul { padding-inline-start: 20px; margin: 8px 0; }
        li { margin-bottom: 6px; }
        .meta { color: var(--muted); font-size: 13px; margin-bottom: 4px; }
        .contact {
            background: var(--cream2);
            border-radius: 12px;
            padding: 16px 18px;
            margin-top: 24px;
            font-size: 14px;
        }
        .contact b { color: var(--ink); }
        nav.tabs {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-top: 14px;
        }
        nav.tabs a {
            color: #9CA3AF;
            text-decoration: none;
            font-size: 13px;
            padding: 6px 14px;
            border-radius: 999px;
            border: 1px solid #3a352c;
        }
        nav.tabs a.active { color: #fff; background: var(--primary); border-color: var(--primary); }
        footer { text-align: center; color: var(--muted); font-size: 12px; padding-bottom: 30px; }
    </style>
</head>
<body>
    <header>
        <h1>TOYS 141 — متجر ألعاب</h1>
        <p>متجر ألعاب أطفال أونلاين</p>
        <nav class="tabs">
            <a href="<?php echo e(route('privacy')); ?>" class="<?php echo e(request()->routeIs('privacy') ? 'active' : ''); ?>">سياسة الخصوصية</a>
            <a href="<?php echo e(route('terms')); ?>" class="<?php echo e(request()->routeIs('terms') ? 'active' : ''); ?>">شروط الاستخدام</a>
        </nav>
    </header>
    <main>
        <div class="card">
            <p class="meta">آخر تحديث: <?php echo e(now()->translatedFormat('d/m/Y')); ?></p>
            <?php echo $__env->yieldContent('content'); ?>
        </div>
    </main>
    <footer>&copy; <?php echo e(now()->year); ?> TOYS 141 — جميع الحقوق محفوظة</footer>
</body>
</html>
<?php /**PATH C:\laragon\www\toys141-app\resources\views/legal/layout.blade.php ENDPATH**/ ?>