'use strict';

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Intersection Observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Quote form submission
const quoteForm = document.getElementById('quoteForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

quoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset messages
  formSuccess.hidden = true;
  formError.hidden = true;

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone) {
    const firstEmpty = !name ? document.getElementById('name') : document.getElementById('phone');
    firstEmpty.focus();
    firstEmpty.style.borderColor = '#FF5050';
    firstEmpty.addEventListener('input', () => {
      firstEmpty.style.borderColor = '';
    }, { once: true });
    return;
  }

  const payload = {
    name,
    phone,
    email: document.getElementById('email').value.trim(),
    thickness: document.getElementById('thickness').value,
    description: document.getElementById('description').value.trim(),
  };

  // Loading state
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      formSuccess.hidden = false;
      quoteForm.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      formError.hidden = false;
    }
  } catch {
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});

// Smooth scroll for anchor links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
