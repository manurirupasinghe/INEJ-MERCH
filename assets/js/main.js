/**
 * INEJ STUDIOS - Main Global Scripts & Interactivity
 * Collection 01: SOLITUDE
 */

document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
  setupMobileMenu();
  setupCountdownTimer();
  setupNewsletter();
  setupGlobalCurrencyToggles();
});

// Navbar scroll effects
function setupNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-black/90', 'border-b', 'border-zinc-800/80', 'backdrop-blur-md', 'py-3');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.remove('bg-black/90', 'border-b', 'border-zinc-800/80', 'backdrop-blur-md', 'py-3');
      navbar.classList.add('bg-transparent', 'py-5');
    }
  });
}

// Mobile hamburger menu
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('-translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    if (backdrop) {
      backdrop.classList.remove('hidden', 'opacity-0');
      backdrop.classList.add('block', 'opacity-100');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('-translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close when links are clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Countdown timer for next drop / limited stock rush
function setupCountdownTimer() {
  const timerDays = document.getElementById('timer-days');
  const timerHours = document.getElementById('timer-hours');
  const timerMins = document.getElementById('timer-mins');
  const timerSecs = document.getElementById('timer-secs');

  if (!timerDays) return;

  // Set target date 5 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);
  targetDate.setHours(targetDate.getHours() + 18);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      timerDays.textContent = "00";
      timerHours.textContent = "00";
      timerMins.textContent = "00";
      timerSecs.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerDays.textContent = String(days).padStart(2, '0');
    timerHours.textContent = String(hours).padStart(2, '0');
    timerMins.textContent = String(minutes).padStart(2, '0');
    timerSecs.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Newsletter form submission
function setupNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast(`VIP Access granted for ${emailInput.value}! Code SOLITUDE10 copied.`);
        emailInput.value = '';
      }
    });
  });
}

// Currency Switcher buttons
function setupGlobalCurrencyToggles() {
  document.querySelectorAll('.currency-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.currentTarget.dataset.currency;
      if (selected && typeof setCurrency === 'function') {
        setCurrency(selected);
      }
    });
  });
}

// Quick View or Direct Quick Add Helper
function quickAddToCart(productId) {
  // Defaults to size M, or opens product page
  addToCart(productId, "M", 1);
}
