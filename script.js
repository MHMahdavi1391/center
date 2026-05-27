/**
 * LTC HUB — Dynamic Router
 * این اسکریپت به صورت خودکار تمام مسیریاب‌های موجود در پوشه routes/ رو میخونه
 * و بر اساس اطلاعات درون اونا، کارت‌های لینک رو توی صفحه اصلی میسازه.
 */
(function () {
    'use strict';

    const linkGrid = document.getElementById('link-list');
    const emptyState = document.getElementById('empty-state');
    const ROUTES_DIR = './routes/';

    /**
     * ساختار هر فایل داخل پوشه routes/ باید به این صورت باشه
     */
    async function fetchRouteList() {
        try {
            // لیست تمام فایل‌هایی که اسمشون با .html تموم میشه
            const files = await discoverRouteFiles();
            
            if (files.length === 0) {
                showEmptyState();
                return;
            }

            // اطلاعات هر فایل رو استخراج کن
            const routes = [];
            for (const file of files) {
                const info = await extractRouteInfo(`${ROUTES_DIR}${file}`);
                if (info) {
                    routes.push(info);
                }
            }

            if (routes.length === 0) {
                showEmptyState();
                return;
            }

            renderCards(routes);
        } catch (error) {
            console.error('خطا در بارگذاری مسیریاب‌ها:', error);
            showEmptyState();
        }
    }

    /**
     * متد کمکی برای کشف خودکار فایل‌ها.
     */
    async function discoverRouteFiles() {
        const commonRouteNames = [
            'me', 'avaye-shir', 'security', 'archive', 'github',
            'signature', 'music', 'podcast', 'blog', 'contact',
            'about', 'services', 'projects', 'team', 'faq'
        ];

        const existingFiles = [];
        for (const name of commonRouteNames) {
            try {
                const response = await fetch(`${ROUTES_DIR}${name}.html`, { method: 'HEAD' });
                if (response.ok) {
                    existingFiles.push(`${name}.html`);
                }
            } catch (e) {
                // فایل وجود نداره، بی‌خیالش شو
            }
        }
        return existingFiles;
    }

    /**
     * استخراج اطلاعات از یک فایل مسیریاب.
     */
    async function extractRouteInfo(filePath) {
        try {
            const response = await fetch(filePath);
            const htmlText = await response.text();
            
            // پارس کردن HTML (ساده و بدون نیاز به DOMParser سنگین)
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // استخراج اطلاعات
            const targetUrl = doc.querySelector('meta[name="ltc-redirect"]')?.getAttribute('content');
            const displayName = doc.querySelector('meta[name="ltc-name"]')?.getAttribute('content');
            const description = doc.querySelector('meta[name="ltc-desc"]')?.getAttribute('content');
            const icon = doc.querySelector('meta[name="ltc-icon"]')?.getAttribute('content');

            // استخراج slug از مسیر فایل (نام فایل بدون پسوند)
            const fileName = filePath.split('/').pop().replace('.html', '');

            if (!targetUrl) return null;

            return {
                slug: fileName,
                url: targetUrl,
                name: displayName || fileName,
                description: description || '',
                icon: icon || 'fa-solid fa-link'
            };
        } catch (error) {
            console.warn(`خطا در پردازش فایل ${filePath}:`, error);
            return null;
        }
    }

    /**
     * ساختن کارت‌های لینک توی صفحه
     */
    function renderCards(routes) {
        if (!linkGrid) return;
        emptyState.style.display = 'none';
        linkGrid.style.display = 'flex';

        linkGrid.innerHTML = routes.map(route => `
            <a href="${route.url}" class="link-card" target="_blank" rel="noopener noreferrer">
                <i class="${route.icon} card-icon"></i>
                <span class="card-title">${route.name}</span>
                ${route.description ? `<span class="card-desc">${route.description}</span>` : ''}
            </a>
        `).join('');
    }

    function showEmptyState() {
        if (linkGrid) linkGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    }

    // راه‌اندازی
    fetchRouteList();
})();
