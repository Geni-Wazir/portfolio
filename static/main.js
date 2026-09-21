
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

const loadMoreCue = document.getElementById('load-more-cue');

if (loadMoreCue) {
    const nextUrl = loadMoreCue.dataset.nextUrl;
    const BOTTOM_THRESHOLD = 24;
    const ARM_DELAY_MS = 2000;
    let activated = false;
    let navigating = false;
    let activatedAt = 0;

    const isAtBottom = () => {
        const scrolled = window.scrollY + window.innerHeight;
        return scrolled >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
    };

    const isArmed = () => activated && !navigating && (Date.now() - activatedAt >= ARM_DELAY_MS);

    const activate = () => {
        if (activated) return;
        activated = true;
        activatedAt = Date.now();
        loadMoreCue.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
        loadMoreCue.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    };

    const goToNextPage = () => {
        if (navigating || !nextUrl) return;
        navigating = true;
        window.location.href = nextUrl;
    };

    const handleBottomReached = () => {
        if (!isAtBottom()) return;
        if (!activated) {
            activate();
        } else if (isArmed()) {
            goToNextPage();
        }
    };

    window.addEventListener('scroll', handleBottomReached, { passive: true });
    window.addEventListener('load', handleBottomReached);

    window.addEventListener('wheel', (event) => {
        if (isArmed() && event.deltaY > 0 && isAtBottom()) {
            goToNextPage();
        }
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
        if (isArmed() && isAtBottom() && touchStartY - event.touches[0].clientY > 15) {
            goToNextPage();
        }
    }, { passive: true });

    loadMoreCue.addEventListener('click', goToNextPage);
}