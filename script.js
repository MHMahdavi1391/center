<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>در حال انتقال...</title>
    <style>
        body {
            background: #0a0f1c;
            color: #fff;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            direction: rtl;
        }
        .message {
            text-align: center;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="message">
        <p>🚀 در حال انتقال به مقصد...</p>
    </div>

    <script>
        (async function () {
            // 1. گرفتن عدد از آخر مسیر URL
            const path = window.location.pathname.replace(/\/$/, '');
            const segments = path.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            const index = parseInt(lastSegment, 10);

            // اگر عدد معتبری نبود، برو به صفحه اصلی هاب
            if (isNaN(index) || index < 1) {
                window.location.replace('/');
                return;
            }

            // 2. خوندن فایل links.json
            try {
                const response = await fetch('/links.json');
                if (!response.ok) throw new Error('فایل لینک‌ها پیدا نشد.');
                const links = await response.json();

                // 3. انتخاب لینک متناظر (index از ۱ شروع میشه، آرایه از ۰)
                const targetUrl = links[index - 1];

                if (targetUrl) {
                    // انتقال مستقیم به لینک مورد نظر
                    window.location.replace(targetUrl);
                } else {
                    // عدد خارج از محدوده بود → برگشت به هاب
                    window.location.replace('/');
                }
            } catch (error) {
                console.error('خطا در بارگذاری links.json:', error);
                window.location.replace('/');
            }
        })();
    </script>
</body>
</html>
