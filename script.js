document.addEventListener('DOMContentLoaded', () => {
    const linkListElement = document.getElementById('link-list');

    // تابع برای دریافت و نمایش لینک‌ها
    async function loadLinks() {
        try {
            // تلاش برای بارگذاری فایل JSON
            const response = await fetch('links.json');
            
            // بررسی موفقیت آمیز بودن درخواست
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const links = await response.json();
            
            // بررسی اینکه داده آرایه است
            if (!Array.isArray(links)) {
                throw new Error('Data is not an array');
            }

            // اگر آرایه خالی بود پیام مناسب نمایش بده
            if (links.length === 0) {
                linkListElement.innerHTML = '<li class="no-links">هیچ پروژه‌ای برای نمایش وجود ندارد.</li>';
                return;
            }

            // ساخت HTML برای هر لینک
            const linksHTML = links.map(link => {
                // بررسی وجود title و url
                if (!link.title || !link.url) {
                    console.warn('Invalid link data:', link);
                    return '';
                }
                return `
                    <li>
                        <a href="${link.url}" target="_self">
                            ${link.title}
                        </a>
                    </li>
                `;
            }).join('');

            linkListElement.innerHTML = linksHTML;

        } catch (error) {
            console.error('Error loading links:', error);
            linkListElement.innerHTML = `
                <li class="error-message">
                    ⚡ خطا در بارگذاری لینک‌ها. مطمئن شوید فایل links.json وجود دارد.
                </li>
            `;
        }
    }

    // فراخوانی تابع
    loadLinks();
});
