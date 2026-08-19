document.addEventListener('DOMContentLoaded', () => {

    // 12-Hour Clock (Matches OS System Timezone)
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
        searchForm.action = selected.action;
        searchInput.name = selected.param;
        searchInput.placeholder = selected.placeholder;
        localStorage.setItem('startpage_engine', key);
    }

    // Load saved search engine choice
    const savedEngine = localStorage.getItem('startpage_engine') || 'google';
    engineSelect.value = savedEngine;
    setSearchEngine(savedEngine);

    engineSelect.addEventListener('change', (e) => {
        setSearchEngine(e.target.value);
    });

    // Modal UI Handlers
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

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
