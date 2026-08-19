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

    // Settings Modal
    const settingsModal = document.getElementById('settingsModal');
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');

    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    }
    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    }

    // Add Bookmark Modal
    const addBookmarkModal = document.getElementById('addBookmarkModal');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const confirmAddBtn = document.getElementById('confirmAddBtn');

    function openAddModal() {
        document.getElementById('siteTitle').value = '';
        document.getElementById('siteUrl').value = '';
        addBookmarkModal.classList.add('active');
        document.getElementById('siteTitle').focus();
    }

    function closeAddModal() {
        addBookmarkModal.classList.remove('active');
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener('click', openAddModal);
    if (closeAddModalBtn) closeAddModalBtn.addEventListener('click', closeAddModal);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

    // Close modals on background overlay click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
        if (e.target === addBookmarkModal) closeAddModal();
    });

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

    function saveAndAddLink() {
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

        closeAddModal();
        renderLinks();
    }

    if (confirmAddBtn) {
        confirmAddBtn.addEventListener('click', saveAndAddLink);
    }

    // Submit on Enter key inside modal inputs
    document.getElementById('siteUrl').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveAndAddLink();
    });

    function removeLink(index) {
        const links = getLinks();
        links.splice(index, 1);
        localStorage.setItem('startpage_links', JSON.stringify(links));
        renderLinks();
    }

    renderLinks();
});
