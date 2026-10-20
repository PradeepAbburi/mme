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

  // ── Enquiry Form Handlers (Email & WhatsApp) ───────────────────────────
  document.querySelectorAll('form[data-enquiry-form], form[data-mailto-form]').forEach(form => {
    const buildEnquiryData = () => {
      const d = new FormData(form);
      const get = (k) => (d.get(k) || '').toString().trim();
      const name = get('name');
      const company = get('company');
      const country = get('country');
      const email = get('email');
      const phone = get('phone');
      const product = get('product');
      const volume = get('volume');
      const destination = get('destination');
      const spec = get('specification');
      const message = get('message');

      const subject = `Export Enquiry: ${product || 'Seafood'} | ${company || name}`;

      const lines = [
        '========================================',
        'EXPORT ENQUIRY - MAHADEV MARINE EXPORTS',
        '========================================',
        '',
        'BUYER & ENQUIRY DETAILS:',
        `• Name            : ${name}`,
        `• Company         : ${company}`,
        `• Country         : ${country}`,
        `• Email           : ${email}`,
        `• Phone / WhatsApp: ${phone || 'N/A'}`,
        '',
        'REQUIREMENT SPECIFICATIONS:',
        `• Product/Service : ${product}`,
        `• Est. Volume     : ${volume || 'N/A'}`,
        `• Destination Port: ${destination || 'N/A'}`,
        `• Specification   : ${spec || 'Standard specification'}`,
        '',
        'ADDITIONAL REQUIREMENT / MESSAGE:',
        message || 'None provided',
        '',
        '========================================',
        'Regards,',
        name
      ];

      return { subject, body: lines.join('\n') };
    };

    const sendEmail = () => {
      if (!form.reportValidity()) return;

      const { subject, body } = buildEnquiryData();
      const to = 'enquiry@mahadevmarineexports.com';
      const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open email client pre-filled with the template
      window.location.href = mailtoUrl;

      // Show inline feedback on the same page (no navigation)
      const statusMsg = form.querySelector('#form-status-msg');
      if (statusMsg) {
        statusMsg.innerHTML = `✓ <strong>Opening your email app...</strong> Your enquiry details are pre-filled in the email template.<br><span style="display:inline-block;margin-top:4px">If your email app didn't launch automatically, <a href="${gmailWebUrl}" target="_blank" rel="noopener" style="color:#93c5fa;text-decoration:underline;font-weight:600">click here to send via Gmail in browser</a>.</span>`;
        statusMsg.style.display = 'block';
      }
    };

    // Send enquiry via Email button click - NO HTTP submission
    const sendBtn = form.querySelector('#btn-send-email') || form.querySelector('button[type="submit"]');
    sendBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sendEmail();
    });

    // Form submit prevention - guarantees NO HTTP 405 error on static hosts
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sendEmail();
      return false;
    });

    // Enter key handling
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        sendEmail();
      }
    });

    // Send via WhatsApp
    const waButton = form.querySelector('[data-send-whatsapp]');
    waButton?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const { body } = buildEnquiryData();
      const waUrl = `https://wa.me/919059861256?text=${encodeURIComponent(body)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });
})();
