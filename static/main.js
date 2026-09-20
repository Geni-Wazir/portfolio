
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', storedTheme ? storedTheme === 'dark' : prefersDark);

const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

if (themeToggleBtn && themeToggleDarkIcon && themeToggleLightIcon) {
    const setIcon = () => {
        const isDark = document.documentElement.classList.contains('dark');
        themeToggleDarkIcon.classList.toggle('hidden', isDark);
        themeToggleLightIcon.classList.toggle('hidden', !isDark);
    };

    setIcon();

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        setIcon();
    });
}

const searchInput = document.getElementById('search-blog');
const blogGrid = document.getElementById('blogs');
const notFound = document.getElementById('notFound');

if (searchInput && blogGrid && notFound) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const cards = blogGrid.querySelectorAll('.blog-card');
        let hasVisibleBlogs = false;

        cards.forEach(card => {
            const visible = searchTerm === '' || card.innerText.toLowerCase().includes(searchTerm);
            card.classList.toggle('hidden', !visible);
            if (visible) hasVisibleBlogs = true;
        });

        notFound.classList.toggle('hidden', hasVisibleBlogs);
    });
}