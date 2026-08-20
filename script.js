/**
 * LTC HUB — Dynamic Route Loader + i18n
 */
(function () {
    'use strict';

    const I18N = {
        fa: {
            tagline: 'دسترسی یکپارچه به سرویس‌ها و زیرمجموعه‌های شرکت',
            empty: 'در حال حاضر مسیریابی فعالی وجود ندارد.',
            contact_label: 'ارتباط با مدیریت',
            call: 'تماس',
            footer_credit: 'طراحی و توسعه با دقت',
            routes: {
                me: 'از سازنده شرکت بیشتر بدانید',
                shop: 'فروشگاه خدمات دیجیتال',
                yelo: 'YELO Music',
                survey: 'نظرسنجی'
            }
        },
        en: {
            tagline: 'Unified access to company services and subsidiaries',
            empty: 'No active routes available at the moment.',
            contact_label: 'Contact management',
            call: 'Call',
            footer_credit: 'Designed and built with care',
            routes: {
                me: 'Learn more about the founder',
                shop: 'Digital services shop',
                yelo: 'YELO Music',
                survey: 'Survey'
            }
        }
    };

    const linkGrid = document.getElementById('link-list');
    const emptyState = document.getElementById('empty-state');
    const ROUTE_NAMES = ['me', 'shop', 'yelo', 'survey'];
    let cachedRoutes = [];
    let lang = localStorage.getItem('ltc_lang') || 'fa';

    function applyStaticI18n() {
        const dict = I18N[lang] || I18N.fa;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.querySelectorAll('#langToggle button').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
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
            return (
                '<a href="' + route.url + '" class="link-card" target="_blank" rel="noopener noreferrer">' +
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
