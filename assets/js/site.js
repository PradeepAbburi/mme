(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const preloader = document.querySelector('.preloader');

  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('loaded'), 280);
  });

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const closeNav = () => {
    body.classList.remove('nav-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  const toggleNav = (e) => {
    if (e) e.stopPropagation();
    const open = body.classList.toggle('nav-open');
    menuToggle?.setAttribute('aria-expanded', String(open));
  };

  menuToggle?.addEventListener('click', toggleNav);

  navLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  const navLinksContainer = document.querySelector('.nav-links');
  if (navLinksContainer && !navLinksContainer.querySelector('.mobile-menu-cta')) {
    const mobileCta = document.createElement('a');
    mobileCta.href = 'contact.html';
    mobileCta.className = 'mobile-menu-cta';
    mobileCta.textContent = 'Request Export Quote';
    mobileCta.style.display = 'none';
    mobileCta.addEventListener('click', closeNav);
    navLinksContainer.appendChild(mobileCta);
  }

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  reveals.forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: .6 });
  counters.forEach(el => counterObserver.observe(el));

  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      productCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  const canHover = window.matchMedia('(hover:hover)').matches;
  if (canHover) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  const canvas = document.getElementById('oceanCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let points = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = Array.from({ length: Math.max(28, Math.floor(width / 40)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + .4,
        vy: Math.random() * .22 + .05,
        phase: Math.random() * Math.PI * 2
      }));
    };
    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(215,182,107,.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const base = height * (.58 + i * .1);
        for (let x = 0; x <= width; x += 10) {
          const y = base + Math.sin(x * .009 + time * .00035 + i) * (10 + i * 5);
          x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      points.forEach(p => {
        p.y -= p.vy;
        p.x += Math.sin(time * .0004 + p.phase) * .08;
        if (p.y < -6) { p.y = height + 6; p.x = Math.random() * width; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(232,210,162,.28)';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Mailto form submission (no backend needed) ───────────────────────────
  document.querySelectorAll('form[data-mailto-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const get = (k) => (d.get(k) || '').toString().trim();

      const subject = encodeURIComponent(
        `Export Enquiry – ${get('product') || 'Seafood'} | ${get('company') || get('name')}`
      );

      const body = encodeURIComponent([
        'Hello Mahadev Marine Exports,',
        '',
        'I would like to submit the following export enquiry:',
        '',
        `Name            : ${get('name')}`,
        `Company         : ${get('company')}`,
        `Country         : ${get('country')}`,
        `Email           : ${get('email')}`,
        `Phone/WhatsApp  : ${get('phone')}`,
        `Product/Service : ${get('product')}`,
        `Est. Volume     : ${get('volume')}`,
        `Destination     : ${get('destination')}`,
        `Specification   : ${get('specification')}`,
        '',
        'Additional details:',
        get('message'),
        '',
        'Regards,',
        get('name')
      ].join('\n'));

      window.location.href =
        `mailto:enquiry@mahadevmarineexports.com?subject=${subject}&body=${body}`;
    });
  });

  // ── WhatsApp quick-send ──────────────────────────────────────────────────
  document.querySelectorAll('form[data-whatsapp-form]').forEach(form => {
    const waButton = form.querySelector('[data-send-whatsapp]');
    waButton?.addEventListener('click', () => {
      const data = new FormData(form);
      const lines = [
        'Hello Mahadev Marine Exports,',
        '',
        'I would like an export quotation for seafood, agro products or shrimp byproducts.',
        `Name: ${data.get('name') || ''}`,
        `Company: ${data.get('company') || ''}`,
        `Country: ${data.get('country') || ''}`,
        `Product: ${data.get('product') || ''}`,
        `Volume: ${data.get('volume') || ''}`,
        `Specification: ${data.get('specification') || ''}`,
        `Message: ${data.get('message') || ''}`
      ];
      window.open(`https://wa.me/919059861256?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  });
})();
