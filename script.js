document.addEventListener('DOMContentLoaded', () => {

    // Theme Switcher Logic
    const themeSelect = document.getElementById('themeSelect');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('startpage_theme', theme);
    }

    const savedTheme = localStorage.getItem('startpage_theme') || 'dark';
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', (e) => setTheme(e.target.value));
    }
    setTheme(savedTheme);

    // 12-Hour Clock (OS System Time)
    function updateClock() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], { 
            hour: 'numeric', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Modal Control
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.add('active');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Search Engine Configuration
    const engines = {
        google: { action: "https://www.google.com/search", param: "q", placeholder: "Search Google..." },
        duckduckgo: { action: "https://duckduckgo.com/", param: "q", placeholder: "Search DuckDuckGo..." },
        bing: { action: "https://www.bing.com/search", param: "q", placeholder: "Search Bing..." },
        yahoo: { action: "https://search.yahoo.com/search", param: "p", placeholder: "Search Yahoo..." }
    };

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const engineSelect = document.getElementById('engineSelect');

    function setSearchEngine(key) {
        const selected = engines[key] || engines.google;
        if (searchForm) searchForm.action = selected.action;
        if (searchInput) {
            searchInput.name = selected.param;
            searchInput.placeholder = selected.placeholder;
        }
        localStorage.setItem('startpage_engine', key);
    }

    const savedEngine = localStorage.getItem('startpage_engine') || 'google';
    if (engineSelect) {
        engineSelect.value = savedEngine;
        engineSelect.addEventListener('change', (e) => setSearchEngine(e.target.value));
    }
    setSearchEngine(savedEngine);

    // Bookmarks Logic
    const defaults = [
        { name: "YouTube", url: "https://youtube.com" },
        { name: "GitHub", url: "https://github.com" },
        { name: "Reddit", url: "https://reddit.com" }
    ];

    function getLinks() {
        const data = localStorage.getItem('startpage_links');
        return data ? JSON.parse(data) : defaults;
    }

    function renderLinks() {
        const links = getLinks();
        const grid = document.getElementById('bookmarksGrid');
        if (!grid) return;
        grid.innerHTML = '';

        links.forEach((item, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'card-wrapper';

            const card = document.createElement('a');
            card.className = 'bookmark-card';
            card.href = item.url;
            card.innerText = item.name;

            const del = document.createElement('button');
            del.className = 'del-btn';
            del.innerText = '×';
            del.onclick = (e) => {
                e.preventDefault();
                removeLink(idx);
            };

            wrap.appendChild(card);
            wrap.appendChild(del);
            grid.appendChild(wrap);
        });
    }

    function addLink() {
        const nameEl = document.getElementById('siteTitle');
        const urlEl = document.getElementById('siteUrl');
        
        let name = nameEl.value.trim();
        let url = urlEl.value.trim();

        if (!name || !url) return;

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const links = getLinks();
        links.push({ name, url });
        localStorage.setItem('startpage_links', JSON.stringify(links));

        nameEl.value = '';
        urlEl.value = '';
        renderLinks();
    }

    function removeLink(index) {
        const links = getLinks();
        links.splice(index, 1);
        localStorage.setItem('startpage_links', JSON.stringify(links));
        renderLinks();
    }

    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addLink);
    }

    renderLinks();
});
