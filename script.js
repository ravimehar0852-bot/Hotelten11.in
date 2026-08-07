/* ============================================================
   HOTEL TEN 11 — Shared JS
   ============================================================ */

const WHATSAPP_NUMBER = "917240774000"; // +91 72407 74000

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initGalleryFilter();
  initLightbox();
  initBookingForm();
  initFooterYear();
  initRoomWhatsappLinks();
});

/* ---------------- Nav: mobile toggle + active link + scroll shadow ---------------- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');
  if (toggle && mobile){
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobile.classList.remove('is-open');
      toggle.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  // active link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!('IntersectionObserver' in window) || !targets.length){
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  targets.forEach(t => io.observe(t));
}

/* ---------------- Gallery filter ---------------- */
function initGalleryFilter(){
  const filters = document.querySelectorAll('.gfilter');
  const items = document.querySelectorAll('.gitem');
  if (!filters.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hide', !match);
      });
    });
  });
}

/* ---------------- Lightbox ---------------- */
function initLightbox(){
  const items = Array.from(document.querySelectorAll('.gitem'));
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const imgEl = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let visible = [];
  let index = 0;

  function refreshVisible(){
    visible = items.filter(i => !i.classList.contains('hide'));
  }
  function open(item){
    refreshVisible();
    index = visible.indexOf(item);
    show();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function show(){
    const item = visible[index];
    if (!item) return;
    const img = item.querySelector('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt;
  }
  function close(){
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function step(dir){
    if (!visible.length) return;
    index = (index + dir + visible.length) % visible.length;
    show();
  }

  items.forEach(item => item.addEventListener('click', () => open(item)));
  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', () => step(-1));
  nextBtn && nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ---------------- Booking / enquiry form -> WhatsApp ---------------- */
function initBookingForm(){
  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#f-name')?.value.trim() || '';
    const phone = form.querySelector('#f-phone')?.value.trim() || '';
    const roomType = form.querySelector('#f-room')?.value || '';
    const dates = form.querySelector('#f-dates')?.value.trim() || '';
    const message = form.querySelector('#f-message')?.value.trim() || '';

    if (!name || !phone){
      form.querySelector('#f-name').reportValidity();
      return;
    }

    const lines = [
      `Hello Hotel Ten 11, I'd like to enquire about a stay.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      roomType ? `Room type: ${roomType}` : '',
      dates ? `Preferred dates: ${dates}` : '',
      message ? `Message: ${message}` : ''
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank');
  });
}

/* ---------------- Per-room "Reserve on WhatsApp" buttons ---------------- */
function initRoomWhatsappLinks(){
  document.querySelectorAll('[data-room-whatsapp]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const room = btn.dataset.roomWhatsapp;
      const text = `Hello Hotel Ten 11, I'd like to book the ${room}. Please share availability.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });
  });
}

/* ---------------- Footer year ---------------- */
function initFooterYear(){
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}
