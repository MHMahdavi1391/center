document.addEventListener('DOMContentLoaded', () => {
    const linkListElement = document.getElementById('link-list');

    async function loadLinks() {
        try {
            const response = await fetch('links.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const links = await response.json();
            
            if (!Array.isArray(links)) {
                throw new Error('Data is not an array');
            }

            if (links.length === 0) {
                linkListElement.innerHTML = '<li class="no-links">هیچ پروژه‌ای برای نمایش وجود ندارد.</li>';
                return;
            }

            const linksHTML = links.map(link => {
                if (!link.title || !link.url) {
                    console.warn('Invalid link data:', link);
                    return '';
                }
                return `
                    <li>
                        <a href="${link.url}" target="_self" rel="noopener">
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
                    خطا در بارگذاری لینک‌ها. لطفاً دوباره تلاش کنید.
                </li>
            `;
        }
    }

    loadLinks();
});
