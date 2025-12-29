(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  // Year in footer
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = $('.nav-toggle');
  const menu = $('#navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      const isClickInside = menu.contains(e.target) || toggle.contains(e.target);
      if (!isClickInside && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Gallery
  const grid = $('#galleryGrid');
  if (grid) {
    fetch('assets/gallery.json')
      .then(r => r.json())
      .then(items => {
        let current = 'all';

        const render = () => {
          grid.innerHTML = '';
          const filtered = current === 'all' ? items : items.filter(i => i.tags.includes(current));
          filtered.forEach(i => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'g-item';
            card.setAttribute('aria-label', `Open photo: ${i.title}`);
            card.innerHTML = `
              <img loading="lazy" src="${i.src}" alt="${i.title}">
              <div class="g-cap">
                <b>${i.title}</b>
                <span>${i.subtitle ?? ''}</span>
              </div>
            `;
            card.addEventListener('click', () => openLightbox(i));
            grid.appendChild(card);
          });
        };

        // Filter chips
        $$('.chip').forEach(c => {
          c.addEventListener('click', () => {
            $$('.chip').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
            current = c.dataset.filter;
            render();
          });
        });

        // Lightbox
        const dlg = $('#lightbox');
        const img = $('#lightboxImg');
        const cap = $('#lightboxCap');
        const closeBtn = $('.lightbox-close');
        const openLightbox = (i) => {
          img.src = i.src;
          img.alt = i.title;
          cap.textContent = i.subtitle || '';
          dlg.showModal();
        };
        const close = () => dlg.close();
        closeBtn?.addEventListener('click', close);
        dlg?.addEventListener('click', (e) => {
          const rect = dlg.getBoundingClientRect();
          const inDialog = rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;
          if (!inDialog) close();
        });

        render();
      })
      .catch(() => {
        grid.innerHTML = '<p class="muted">Gallery data missing. Add images to /assets/gallery/ and update assets/gallery.json.</p>';
      });
  }
})();
