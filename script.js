/**
 * LTC HUB — Dynamic Route Loader
 */
(function () {
    'use strict';

    const linkGrid = document.getElementById('link-list');
    const emptyState = document.getElementById('empty-state');

    // 👇 لیست فایل‌های داخل ریشه (بدون .html)
    const ROUTE_NAMES = [
        'me',
        'shop',
        'farava',
        'survey'
    ];

    async function loadRoutes() {
        const routes = [];

        for (const name of ROUTE_NAMES) {
            const url = `./${name}.html`;
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

                routes.push({
                    slug: name,
                    url: targetUrl,
                    name: displayName,
                    description: description,
                    icon: icon
                });
            } catch (e) {
                // فایل وجود ندارد یا خطا در پردازش
            }
        }

        if (routes.length === 0) {
            linkGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

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

    loadRoutes();
})();
