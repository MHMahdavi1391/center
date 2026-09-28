/**
 * LTC HUB — Dynamic Route Loader + i18n
 */
(function () {
    'use strict';

    const I18N = {
        fa: {
            tagline: 'دسترسی یکپارچه به سرویس‌ها و معرفی شرکت',
            empty: 'در حال حاضر مسیریابی فعالی وجود ندارد.',
            contact_label: 'ارتباط با مدیریت',
            call: 'تماس',
            footer_credit: 'طراحی و توسعه با دقت',
            s_msg: 'پیام به شرکت',
            s_3d: 'محصولات پرینت سه‌بعدی',
            s_ig: 'اینستاگرام',
            co_eyebrow: 'شرکت',
            co_title: 'Lumen Technologies Co.',
            co_p1: 'Lumen Technologies Co. (LTC) مجموعه‌ای فناورانه، امنیتی و رسانه‌ای است که خدمات دیجیتال، تولید محتوای حرفه‌ای و حمایت از هنرمندان مستقل را زیر یک سقف نگه می‌دارد.',
            co_p2: 'اولویت مجموعه امنیت، شفافیت و اخلاق حرفه‌ای در فضای دیجیتال است. پورتال رسمی این مجموعه همین هاب است.',
            about_eyebrow: 'سازنده',
            about_title: 'محمد حسین مهدوی',
            about_p1: 'محمد حسین مهدوی بنیان‌گذار و مدیرکل Lumen Technologies Co. است؛ مجموعه‌ای که فناوری، امنیت و رسانه را در یک روایت واحد جمع کرده است.',
            about_p2: 'او از نوجوانی با برنامه‌نویسی، امنیت سایبری و مدیریت پروژه‌های دیجیتال کار کرد و امروز چند حوزه را زیر یک سقف مدیریت می‌کند.',
            stat_company: 'شرکت اصلی',
            stat_label: 'لیبل موسیقی',
            stat_portal: 'پورتال رسمی',
            stat_priority: 'اولویت مجموعه',
            stat_priority_v: 'امنیت و شفافیت',
            v1: 'هسته‌ی اصلی مجموعه؛ خدمات فناورانه و امنیتی با تمرکز بر اعتماد.',
            v1t: 'فناوری · امنیت',
            v2: 'لیبل موسیقی مجموعه برای حمایت از هنرمندان مستقل و نشر آثار باکیفیت.',
            v2t: 'نشر موسیقی',
            v5h: 'کتابخانه لومن / VR',
            v5: 'کتابخانه و ابزارهای واقعیت مجازی برای Quest و اندروید.',
            v3h: 'مجمع فرهنگی‌آموزشی امام هادی (ع)',
            v3: 'مدیریت تولید محتوا و رسانه، از تولید تا انتشار.',
            v3t: 'رسانه · محتوا',
            v6h: 'پرینت سه‌بعدی',
            v6: 'مشاهده و سفارش محصولات پرینت سه‌بعدی از کانال تلگرام.',
            quote: 'شفافیت، امنیت و اخلاق حرفه‌ای در فضای دیجیتال، پایه‌های اعتماد و پیشرفت هستند.',
            routes: {
                me: 'معرفی سازنده و شرکت',
                yelo: 'YELO Music',
                survey: 'نظرسنجی',
                VR: 'کتابخانه لومن',
                print3d: 'محصولات پرینت سه‌بعدی'
            }
        },
        en: {
            tagline: 'Unified access to services and company introduction',
            empty: 'No active routes available at the moment.',
            contact_label: 'Contact management',
            call: 'Call',
            footer_credit: 'Designed and built with care',
            s_msg: 'Message the company',
            s_3d: '3D print products',
            s_ig: 'Instagram',
            co_eyebrow: 'Company',
            co_title: 'Lumen Technologies Co.',
            co_p1: 'Lumen Technologies Co. (LTC) is a technology, security, and media group that brings digital services, professional content, and support for independent artists under one roof.',
            co_p2: 'The group priority is security, transparency, and professional ethics in digital spaces. This hub is the official portal.',
            about_eyebrow: 'Founder',
            about_title: 'Mohammad Hosein Mahdavi',
            about_p1: 'Mohammad Hosein Mahdavi is the founder and CEO of Lumen Technologies Co., bringing technology, security, and media into one narrative.',
            about_p2: 'He started with programming, cybersecurity, and digital projects at a young age and now manages several fields under one roof.',
            stat_company: 'Main company',
            stat_label: 'Music label',
            stat_portal: 'Official portal',
            stat_priority: 'Group priority',
            stat_priority_v: 'Security and transparency',
            v1: 'The core of the group: technology and security services focused on trust.',
            v1t: 'Technology · Security',
            v2: 'The group music label, created to support independent artists and publish high-quality music.',
            v2t: 'Music publishing',
            v5h: 'Lumen Library / VR',
            v5: 'VR library and tools for Quest and Android.',
            v3h: 'Imam Hadi Cultural and Educational Assembly',
            v3: 'Content and media management, from production to publication.',
            v3t: 'Media · Content',
            v6h: '3D printing',
            v6: 'Browse and order 3D printed products from the Telegram channel.',
            quote: 'Transparency, security, and professional ethics in digital spaces are the foundations of trust and progress.',
            routes: {
                me: 'Founder and company',
                yelo: 'YELO Music',
                survey: 'Survey',
                VR: 'Lumen Library',
                print3d: '3D print products'
            }
        }
    };

    const linkGrid = document.getElementById('link-list');
    const emptyState = document.getElementById('empty-state');
    const ROUTE_NAMES = ['me', 'yelo', 'print3d', 'survey', 'VR'];
    let cachedRoutes = [];
    let lang = localStorage.getItem('ltc_lang') || 'fa';

    function applyStaticI18n() {
        const dict = I18N[lang] || I18N.fa;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.innerHTML = dict[key];
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.querySelectorAll('#langToggle button').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    function isExternal(url) {
        return /^https?:\/\//i.test(url) && url.indexOf(location.host) === -1 && url.indexOf('lt-c.iddns.ir') === -1;
    }

    function renderRoutes() {
        if (!cachedRoutes.length) {
            linkGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        linkGrid.style.display = 'flex';
        const routeNames = (I18N[lang] || I18N.fa).routes;
        linkGrid.innerHTML = cachedRoutes.map(function (route) {
            const title = routeNames[route.slug] || route.name;
            const extra = isExternal(route.url)
                ? ' target="_blank" rel="noopener noreferrer"'
                : '';
            return (
                '<a href="' + route.url + '" class="link-card"' + extra + '>' +
                '<div class="card-icon"><i class="' + route.icon + '"></i></div>' +
                '<div class="card-content">' +
                '<span class="card-title">' + title + '</span>' +
                (route.description ? '<span class="card-desc">' + route.description + '</span>' : '') +
                '</div>' +
                '<i class="fas fa-chevron-left card-arrow"></i>' +
                '</a>'
            );
        }).join('');
    }

    async function loadRoutes() {
        const routes = [];
        for (const name of ROUTE_NAMES) {
            const url = './' + name + '.html';
            try {
                const response = await fetch(url);
                if (!response.ok) continue;
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                const targetUrl = doc.querySelector('meta[name="ltc-redirect"]')?.getAttribute('content');
                if (!targetUrl) continue;
                const displayName = doc.querySelector('meta[name="ltc-name"]')?.getAttribute('content') || name;
                const description = doc.querySelector('meta[name="ltc-desc"]')?.getAttribute('content') || '';
                const icon = doc.querySelector('meta[name="ltc-icon"]')?.getAttribute('content') || 'fa-solid fa-link';
                routes.push({ slug: name, url: targetUrl, name: displayName, description: description, icon: icon });
            } catch (e) { /* skip */ }
        }
        cachedRoutes = routes;
        renderRoutes();
    }

    function setLang(next) {
        lang = next;
        localStorage.setItem('ltc_lang', lang);
        applyStaticI18n();
        renderRoutes();
    }

    document.querySelectorAll('#langToggle button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setLang(btn.getAttribute('data-lang'));
        });
    });

    applyStaticI18n();
    loadRoutes();
})();
