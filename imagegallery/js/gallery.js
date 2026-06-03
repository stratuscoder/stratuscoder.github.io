(() => {
    'use strict';

    // ─── Auth ─────────────────────────────────────────────────────────────────
    const AUTH_SESSION_KEY = 'gallery_auth';
    const GALLERY_PASSWORD = 'destinflorida';

    function isAuthenticated() {
        return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
    }

    function grantAccess() {
        sessionStorage.setItem(AUTH_SESSION_KEY, '1');
        document.documentElement.classList.add('authenticated');
    }

    function initAuth() {
        if (isAuthenticated()) return; // inline script already added the class

        const overlay   = document.getElementById('auth-overlay');
        const form      = document.getElementById('auth-form');
        const input     = document.getElementById('auth-input');
        const error     = document.getElementById('auth-error');
        const toggle    = document.getElementById('auth-toggle');
        const eyeOn     = toggle.querySelector('.icon-eye');
        const eyeOff    = toggle.querySelector('.icon-eye-off');

        // Show/hide password toggle
        toggle.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type      = isPassword ? 'text' : 'password';
            eyeOn.style.display  = isPassword ? 'none'  : '';
            eyeOff.style.display = isPassword ? ''      : 'none';
            input.focus();
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            const val = input.value;

            if (val === GALLERY_PASSWORD) {
                error.textContent = '';
                // Fade out overlay then grant access
                overlay.style.transition = 'opacity .3s ease';
                overlay.style.opacity    = '0';
                overlay.addEventListener('transitionend', () => {
                    grantAccess();
                }, { once: true });
            } else {
                error.textContent = 'Incorrect password. Please try again.';
                input.value = '';
                input.classList.add('shake');
                input.addEventListener('animationend', () => {
                    input.classList.remove('shake');
                }, { once: true });
                input.focus();
            }
        });
    }

    initAuth();

    // ─── Cookie helpers ───────────────────────────────────────────────────────
    const Cookie = {
        get(name) {
            const m = document.cookie.match(
                new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)')
            );
            return m ? decodeURIComponent(m[1]) : null;
        },
        set(name, value, days) {
            const exp = new Date(Date.now() + (days || 365) * 864e5).toUTCString();
            document.cookie =
                encodeURIComponent(name) + '=' + encodeURIComponent(value) +
                '; expires=' + exp + '; path=/; SameSite=Lax';
        }
    };

    // ─── Favorites (cookie-backed) ────────────────────────────────────────────
    const FAV_KEY = 'gallery_favorites';
    const Favorites = {
        getAll() {
            const raw = Cookie.get(FAV_KEY);
            return raw ? raw.split(',').filter(Boolean) : [];
        },
        isFav(filename) {
            return this.getAll().includes(filename);
        },
        toggle(filename) {
            const list = this.getAll();
            const idx  = list.indexOf(filename);
            if (idx === -1) { list.push(filename); }
            else            { list.splice(idx, 1); }
            Cookie.set(FAV_KEY, list.join(','));
            return idx === -1; // true = now favorited
        }
    };

    // ─── State ────────────────────────────────────────────────────────────────
    let allImages      = [];   // full list from manifest
    let visibleImages  = [];   // currently shown (filtered)
    let activeFilter   = 'all';
    let searchQuery    = '';
    let lbIndex        = 0;    // lightbox index in visibleImages

    // ─── DOM refs ─────────────────────────────────────────────────────────────
    const grid         = document.getElementById('gallery-grid');
    const emptyState   = document.getElementById('empty-state');
    const emptyTitle   = document.getElementById('empty-title');
    const emptyHint    = document.getElementById('empty-hint');
    const countAll     = document.getElementById('count-all');
    const countFavs    = document.getElementById('count-favorites');
    const btnAll       = document.getElementById('btn-all');
    const btnFavs      = document.getElementById('btn-favorites');
    const searchInput  = document.getElementById('search-input');
    const lightbox     = document.getElementById('lightbox');
    const lbImg        = document.getElementById('lightbox-img');
    const lbTitle      = document.getElementById('lightbox-title');
    const lbCounter    = document.getElementById('lightbox-counter');
    const lbFavBtn     = document.getElementById('lightbox-fav-btn');
    const lbDlBtn      = document.getElementById('lightbox-download-btn');
    const lbClose      = document.getElementById('lightbox-close');
    const lbPrev       = document.getElementById('lightbox-prev');
    const lbNext       = document.getElementById('lightbox-next');
    const lbBackdrop   = document.getElementById('lightbox-backdrop');

    // ─── Inline SVGs ──────────────────────────────────────────────────────────
    const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const SVG_DL    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
    const SVG_ZOOM  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

    // ─── Filter helpers ───────────────────────────────────────────────────────
    function applyFilter() {
        let result = allImages;
        if (activeFilter === 'favorites') {
            result = result.filter(img => Favorites.isFav(img.filename));
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(img =>
                img.title.toLowerCase().includes(q) ||
                img.filename.toLowerCase().includes(q)
            );
        }
        return result;
    }

    function favCount() {
        return allImages.filter(img => Favorites.isFav(img.filename)).length;
    }

    function updateCounts() {
        countAll.textContent  = allImages.length;
        countFavs.textContent = favCount();
    }

    // ─── Card builder ─────────────────────────────────────────────────────────
    function buildCard(img, animIdx) {
        const fav  = Favorites.isFav(img.filename);
        const card = document.createElement('div');
        card.className    = 'card';
        card.role         = 'listitem';
        card.dataset.file = img.filename;
        card.style.animationDelay = Math.min(animIdx * 0.045, 0.55) + 's';

        card.innerHTML = `
            <div class="card-image" tabindex="0" role="button" aria-label="View ${escAttr(img.title)}">
                <img src="images/${escAttr(img.filename)}" alt="${escAttr(img.title)}" loading="lazy">
                <div class="card-overlay">
                    <button class="btn-zoom" tabindex="-1" aria-hidden="true">${SVG_ZOOM}</button>
                </div>
                <button class="card-fav-badge ${fav ? 'favorited' : ''}"
                        data-role="fav-badge"
                        aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
                        title="${fav ? 'Remove from favorites' : 'Add to favorites'}">
                    ${SVG_HEART}
                </button>
            </div>
            <div class="card-footer">
                <span class="card-title" title="${escAttr(img.title)}">${escHtml(img.title)}</span>
                <div class="card-actions">
                    <button class="btn-fav ${fav ? 'favorited' : ''}" data-role="fav-text" aria-label="Toggle favorite">
                        ${SVG_HEART} ${fav ? 'Saved' : 'Favorite'}
                    </button>
                    <a class="btn-download"
                       href="downloads/${escAttr(img.filename)}"
                       download="${escAttr(img.filename)}"
                       aria-label="Download ${escAttr(img.title)}">
                        ${SVG_DL} Download
                    </a>
                </div>
            </div>`;

        // Click image area → open lightbox
        const imgArea = card.querySelector('.card-image');
        imgArea.addEventListener('click', e => {
            if (e.target.closest('[data-role]')) return;
            openLightbox(visibleImages.indexOf(img));
        });
        imgArea.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-role]')) {
                e.preventDefault();
                openLightbox(visibleImages.indexOf(img));
            }
        });

        // Fav buttons
        card.querySelectorAll('[data-role="fav-badge"], [data-role="fav-text"]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                handleFavoriteToggle(img.filename);
            });
        });

        return card;
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    function render() {
        visibleImages = applyFilter();
        updateCounts();

        grid.innerHTML = '';

        if (visibleImages.length === 0) {
            emptyState.style.display = 'flex';
            if (allImages.length === 0) {
                emptyTitle.textContent = 'No images found.';
                emptyHint.style.display = '';
            } else if (activeFilter === 'favorites') {
                emptyTitle.textContent = 'No favorites yet.';
                emptyHint.style.display = 'none';
            } else {
                emptyTitle.textContent = `No results for "${searchQuery}"`;
                emptyHint.style.display = 'none';
            }
            return;
        }

        emptyState.style.display = 'none';
        const frag = document.createDocumentFragment();
        visibleImages.forEach((img, i) => frag.appendChild(buildCard(img, i)));
        grid.appendChild(frag);
    }

    // ─── Favorite toggle ──────────────────────────────────────────────────────
    function handleFavoriteToggle(filename) {
        const nowFav = Favorites.toggle(filename);
        updateCounts();

        // Update cards currently in DOM
        document.querySelectorAll(`.card[data-file="${CSS.escape(filename)}"]`).forEach(card => {
            const badge   = card.querySelector('[data-role="fav-badge"]');
            const textBtn = card.querySelector('[data-role="fav-text"]');

            if (badge) {
                badge.classList.toggle('favorited', nowFav);
                badge.setAttribute('aria-label', nowFav ? 'Remove from favorites' : 'Add to favorites');
                badge.title = nowFav ? 'Remove from favorites' : 'Add to favorites';
            }
            if (textBtn) {
                textBtn.classList.toggle('favorited', nowFav);
                textBtn.innerHTML = SVG_HEART + (nowFav ? ' Saved' : ' Favorite');
            }

            // If in favorites mode and just un-favorited, animate-out then remove
            if (activeFilter === 'favorites' && !nowFav) {
                card.style.animation = 'fadeOutShrink .2s ease forwards';
                card.addEventListener('animationend', () => {
                    card.remove();
                    visibleImages = applyFilter();
                    if (visibleImages.length === 0) {
                        emptyState.style.display = 'flex';
                        emptyTitle.textContent = 'No favorites yet.';
                        emptyHint.style.display = 'none';
                    }
                }, { once: true });
            }
        });

        // Sync lightbox if it's showing this image
        if (lightbox.classList.contains('open') && visibleImages[lbIndex]?.filename === filename) {
            lbFavBtn.classList.toggle('favorited', nowFav);
            if (activeFilter === 'favorites' && !nowFav) {
                closeLightbox();
            }
        }
    }

    // ─── Lightbox ─────────────────────────────────────────────────────────────
    function openLightbox(idx) {
        if (idx < 0 || idx >= visibleImages.length) return;
        lbIndex = idx;
        populateLightbox();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function populateLightbox() {
        const img = visibleImages[lbIndex];
        if (!img) return;

        // Show loading state while new image loads
        lbImg.classList.add('loading');
        const tmp = new Image();
        tmp.onload = () => lbImg.classList.remove('loading');
        tmp.src = 'images/' + img.filename;

        lbImg.src           = 'images/' + img.filename;
        lbImg.alt           = img.title;
        lbTitle.textContent = img.title;
        lbCounter.textContent = (lbIndex + 1) + ' / ' + visibleImages.length;
        lbFavBtn.classList.toggle('favorited', Favorites.isFav(img.filename));
        lbDlBtn.href     = 'downloads/' + img.filename;
        lbDlBtn.download = img.filename;

        lbPrev.style.visibility = lbIndex === 0                        ? 'hidden' : 'visible';
        lbNext.style.visibility = lbIndex === visibleImages.length - 1 ? 'hidden' : 'visible';
    }

    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);

    lbPrev.addEventListener('click', () => {
        if (lbIndex > 0) { lbIndex--; populateLightbox(); }
    });

    lbNext.addEventListener('click', () => {
        if (lbIndex < visibleImages.length - 1) { lbIndex++; populateLightbox(); }
    });

    lbFavBtn.addEventListener('click', () => {
        const img = visibleImages[lbIndex];
        if (img) handleFavoriteToggle(img.filename);
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')  { if (lbIndex > 0)                        { lbIndex--; populateLightbox(); } }
        if (e.key === 'ArrowRight') { if (lbIndex < visibleImages.length - 1) { lbIndex++; populateLightbox(); } }
        if (e.key === 'f' || e.key === 'F') {
            const img = visibleImages[lbIndex];
            if (img) handleFavoriteToggle(img.filename);
        }
    });

    // Touch swipe for lightbox
    let touchX0 = 0;
    lightbox.addEventListener('touchstart', e => { touchX0 = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchX0;
        if (Math.abs(dx) > 50) {
            if (dx < 0 && lbIndex < visibleImages.length - 1) { lbIndex++; populateLightbox(); }
            if (dx > 0 && lbIndex > 0)                        { lbIndex--; populateLightbox(); }
        }
    }, { passive: true });

    // ─── Filter / Search ──────────────────────────────────────────────────────
    btnAll.addEventListener('click', () => {
        activeFilter = 'all';
        btnAll.classList.add('active');
        btnAll.setAttribute('aria-selected', 'true');
        btnFavs.classList.remove('active');
        btnFavs.setAttribute('aria-selected', 'false');
        render();
    });

    btnFavs.addEventListener('click', () => {
        activeFilter = 'favorites';
        btnFavs.classList.add('active');
        btnFavs.setAttribute('aria-selected', 'true');
        btnAll.classList.remove('active');
        btnAll.setAttribute('aria-selected', 'false');
        render();
    });

    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        render();
    });

    // ─── Utility ─────────────────────────────────────────────────────────────
    function escAttr(s) {
        return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // ─── Init ─────────────────────────────────────────────────────────────────
    allImages = Array.isArray(window.GALLERY_IMAGES) ? window.GALLERY_IMAGES : [];
    render();

})();
