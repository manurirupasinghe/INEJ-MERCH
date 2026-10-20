/**
 * INEJ STUDIOS - Cart, Currency, Wishlist & Checkout Engine
 * Collection 01: SOLITUDE
 */

// Application State
const STATE = {
  cart: JSON.parse(localStorage.getItem('inej_cart_v1')) || [],
  wishlist: JSON.parse(localStorage.getItem('inej_wishlist')) || [],
  currency: localStorage.getItem('inej_currency') || 'LKR',
  appliedDiscount: JSON.parse(localStorage.getItem('inej_discount')) || null,
  whatsappNumber: "94771234567", // INEJ Official WhatsApp Orders
  exchangeRateUSD: 0.0033 // 1 LKR approx in USD or based on preset product USD values
};

// Available Promo Codes
const PROMO_CODES = {
  "SOLITUDE10": { type: "percent", value: 10, label: "10% Off Solitude Drop" },
  "FIRSTDROP": { type: "fixed_lkr", value: 1000, valueUSD: 4, label: "Rs. 1,000 Off Welcome" },
  "VIPINEJ": { type: "percent", value: 15, label: "15% VIP Access" }
};

// Initialize Cart System
document.addEventListener("DOMContentLoaded", () => {
  renderCartDrawerUI();
  updateHeaderBadges();
  bindCartEvents();
  updateCurrencyDisplay();
});

// Format Price based on current active currency
function formatPrice(lkr, usd) {
  if (STATE.currency === 'USD') {
    const amount = usd !== undefined ? usd : Math.round(lkr * STATE.exchangeRateUSD);
    return `$${amount.toLocaleString()}`;
  }
  return `Rs. ${lkr.toLocaleString()}`;
}

// Toggle Currency between LKR and USD
function setCurrency(currency) {
  STATE.currency = currency;
  localStorage.setItem('inej_currency', currency);
  updateCurrencyDisplay();
  renderCartItems();
  // Trigger custom event so page specific elements update
  window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
  showToast(`Currency changed to ${currency}`);
}

function updateCurrencyDisplay() {
  document.querySelectorAll('.currency-toggle-btn').forEach(btn => {
    if (btn.dataset.currency === STATE.currency) {
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-zinc-400');
    } else {
      btn.classList.remove('bg-white', 'text-black');
      btn.classList.add('text-zinc-400');
    }
  });

  // Update prices on the current page that have data attributes
  document.querySelectorAll('[data-price-lkr]').forEach(el => {
    const lkr = parseFloat(el.getAttribute('data-price-lkr'));
    const usd = parseFloat(el.getAttribute('data-price-usd')) || undefined;
    el.textContent = formatPrice(lkr, usd);
  });
}

// Add Item to Cart
function addToCart(productId, size = "M", quantity = 1) {
  const product = getProductById(productId);
  if (!product) return;

  const existingIndex = STATE.cart.findIndex(item => item.id === productId && item.size === size);

  if (existingIndex > -1) {
    STATE.cart[existingIndex].quantity += quantity;
  } else {
    STATE.cart.push({
      id: product.id,
      name: product.name,
      size: size,
      quantity: quantity,
      priceLKR: product.priceLKR,
      priceUSD: product.priceUSD,
      image: product.primaryImage,
      color: product.color
    });
  }

  saveCart();
  updateHeaderBadges();
  renderCartItems();
  openCartDrawer();
  showToast(`Added to cart: ${product.name} [Size: ${size}]`);
}

// Update Cart Quantity
function updateQuantity(productId, size, delta) {
  const itemIndex = STATE.cart.findIndex(i => i.id === productId && i.size === size);
  if (itemIndex > -1) {
    STATE.cart[itemIndex].quantity += delta;
    if (STATE.cart[itemIndex].quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    saveCart();
    renderCartItems();
    updateHeaderBadges();
  }
}

// Remove from Cart
function removeFromCart(productId, size) {
  STATE.cart = STATE.cart.filter(item => !(item.id === productId && item.size === size));
  saveCart();
  renderCartItems();
  updateHeaderBadges();
  showToast("Item removed from cart");
}

// Save Cart to Local Storage
function saveCart() {
  localStorage.setItem('inej_cart_v1', JSON.stringify(STATE.cart));
}

// Update badge count
function updateHeaderBadges() {
  const totalCount = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  const wishlistCount = STATE.wishlist.length;
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
    badge.textContent = wishlistCount;
    if (wishlistCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

// Render Drawer Cart HTML Structure into body if not already present
function renderCartDrawerUI() {
  if (document.getElementById('cart-drawer-container')) return;

  const drawerHTML = `
    <!-- Cart Drawer Modal -->
    <div id="cart-drawer-container" class="fixed inset-0 z-50 pointer-events-none">
      <!-- Backdrop -->
      <div id="cart-drawer-backdrop" class="cart-drawer-overlay fixed inset-0 bg-black/80 backdrop-blur-sm opacity-0 invisible transition-all duration-300"></div>

      <!-- Slide Panel -->
      <aside id="cart-drawer-panel" class="cart-drawer-panel fixed top-0 right-0 h-full w-full max-w-md bg-[#0e0e11] border-l border-zinc-800 flex flex-col justify-between translate-x-full z-10 shadow-2xl">
        <!-- Header -->
        <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-zinc-400">INEJ STUDIOS // BAG</span>
            <h3 class="text-xl font-bold font-brand tracking-wider text-white">YOUR SELECTIONS</h3>
          </div>
          <button id="close-cart-btn" class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors" aria-label="Close cart">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Free Shipping Meter -->
        <div class="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/80">
          <div class="flex justify-between text-xs font-mono mb-1">
            <span id="shipping-progress-text" class="text-zinc-300">Islandwide Express Shipping</span>
            <span id="shipping-amount-needed" class="text-emerald-400 font-semibold">FREE over Rs. 20,000</span>
          </div>
          <div class="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div id="shipping-progress-bar" class="bg-gradient-to-r from-zinc-300 to-white h-full w-0 transition-all duration-500"></div>
          </div>
        </div>

        <!-- Cart Items List (Scrollable) -->
        <div id="cart-items-wrapper" class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Injected via JavaScript -->
        </div>

        <!-- Footer / Checkout Area -->
        <div class="p-6 border-t border-zinc-800 bg-[#09090b] space-y-4">
          <!-- Discount Code Input -->
          <div class="flex gap-2">
            <input type="text" id="promo-input" placeholder="DISCOUNT CODE (e.g. SOLITUDE10)" class="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-none px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white uppercase tracking-wider">
            <button id="apply-promo-btn" class="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono px-4 py-2 uppercase tracking-wider transition-colors">Apply</button>
          </div>
          <div id="promo-status" class="text-xs font-mono hidden"></div>

          <!-- Price Breakdown -->
          <div class="space-y-2 text-sm pt-2">
            <div class="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span id="cart-subtotal-price" class="text-white font-mono">Rs. 0</span>
            </div>
            <div id="discount-row" class="flex justify-between text-emerald-400 hidden text-xs font-mono">
              <span id="discount-label">Discount</span>
              <span id="discount-amount">-Rs. 0</span>
            </div>
            <div class="flex justify-between text-zinc-400 text-xs">
              <span>Shipping</span>
              <span id="cart-shipping-price" class="text-zinc-300 font-mono">Calculated next</span>
            </div>
            <div class="border-t border-zinc-800 pt-2 flex justify-between text-base font-bold text-white">
              <span class="font-brand tracking-wider">TOTAL</span>
              <span id="cart-total-price" class="font-mono text-lg">Rs. 0</span>
            </div>
          </div>

          <!-- Checkout Action Buttons -->
          <div class="space-y-2">
            <button id="whatsapp-checkout-btn" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 font-semibold transition-all shadow-lg shadow-emerald-950/30">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.179.182-.077.357.101.174.45 1.002 1.217 1.684.99.88 1.824 1.153 2.084 1.283.26.13.413.116.565-.058.152-.174.65-1.026.824-1.378.174-.352.348-.295.586-.206.238.089 1.517.714 1.777.844.26.13.434.195.498.304.064.108.064.63-.08 1.035z"/>
              </svg>
              Quick Order via WhatsApp
            </button>
            <button id="standard-checkout-btn" class="w-full bg-white hover:bg-zinc-200 text-black py-3.5 px-4 font-mono text-xs uppercase tracking-widest font-bold transition-all">
              Proceed to Card / COD Checkout
            </button>
          </div>

          <p class="text-[10px] text-zinc-500 text-center font-mono uppercase tracking-wider">
            100% Secure Checkout // Islandwide 2-3 Days Delivery
          </p>
        </div>
      </aside>
    </div>

    <!-- Toast Notification Element -->
    <div id="toast-notification" class="fixed bottom-6 right-6 z-50 bg-[#141417] text-white border border-zinc-700/80 px-5 py-3 shadow-2xl flex items-center gap-3 transform translate-y-20 opacity-0 transition-all duration-300 font-mono text-xs">
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span id="toast-message">Notification</span>
    </div>

    <!-- Order Modal (Card / COD Simulation) -->
    <div id="checkout-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden items-center justify-center p-4">
      <div class="bg-[#121215] border border-zinc-800 w-full max-w-lg p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <span class="text-xs font-mono text-zinc-400 uppercase">INEJ STUDIOS CHECKOUT</span>
            <h3 class="text-xl font-bold font-brand tracking-wider text-white">COMPLETE ORDER</h3>
          </div>
          <button id="close-checkout-modal-btn" class="text-zinc-400 hover:text-white">✕</button>
        </div>

        <form id="checkout-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">FIRST NAME *</label>
              <input type="text" required id="cust-first-name" class="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white">
            </div>
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">LAST NAME *</label>
              <input type="text" required id="cust-last-name" class="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white">
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">PHONE NUMBER (FOR DELIVERY) *</label>
            <input type="tel" required id="cust-phone" placeholder="077 123 4567" class="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white">
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">DELIVERY ADDRESS *</label>
            <textarea required id="cust-address" rows="2" placeholder="Street address, City, District" class="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-white"></textarea>
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-2">PAYMENT METHOD</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="border border-zinc-700 p-3 flex items-center gap-2 cursor-pointer hover:border-zinc-500 bg-zinc-900/50">
                <input type="radio" name="paymentMethod" value="cod" checked class="accent-white">
                <span class="text-xs font-mono text-zinc-200">Cash on Delivery</span>
              </label>
              <label class="border border-zinc-700 p-3 flex items-center gap-2 cursor-pointer hover:border-zinc-500 bg-zinc-900/50">
                <input type="radio" name="paymentMethod" value="card" class="accent-white">
                <span class="text-xs font-mono text-zinc-200">Credit / Debit Card</span>
              </label>
            </div>
          </div>

          <div id="card-details-box" class="hidden p-4 bg-zinc-900/80 border border-zinc-700/60 space-y-3">
            <div>
              <label class="block text-[11px] font-mono text-zinc-400 mb-1">CARD NUMBER</label>
              <input type="text" placeholder="4242 •••• •••• 4242" class="w-full bg-black border border-zinc-700 p-2 text-xs text-white font-mono">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/YY" class="bg-black border border-zinc-700 p-2 text-xs text-white font-mono">
              <input type="text" placeholder="CVC" class="bg-black border border-zinc-700 p-2 text-xs text-white font-mono">
            </div>
          </div>

          <div class="border-t border-zinc-800 pt-3">
            <div class="flex justify-between text-sm font-bold text-white mb-4">
              <span>FINAL PAYABLE:</span>
              <span id="modal-final-total" class="font-mono text-emerald-400">Rs. 0</span>
            </div>
            <button type="submit" class="w-full bg-white hover:bg-zinc-200 text-black py-3 font-mono text-xs uppercase tracking-widest font-bold">
              CONFIRM & PLACE ORDER
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Confirmation Modal -->
    <div id="order-success-modal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
      <div class="bg-[#121215] border border-zinc-700 max-w-md w-full p-8 text-center space-y-5">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="text-xs font-mono text-zinc-400 uppercase tracking-widest">ORDER CONFIRMED</span>
        <h3 class="text-2xl font-brand font-bold text-white">WELCOME TO THE SOLITUDE</h3>
        <p class="text-xs text-zinc-400 leading-relaxed font-mono">
          Thank you for choosing INEJ. Your order <span id="success-order-id" class="text-white font-bold">#INEJ-8429</span> has been received. Our concierge team will reach out via WhatsApp/SMS with tracking credentials.
        </p>
        <div class="pt-4 border-t border-zinc-800">
          <button id="close-success-btn" class="w-full bg-white text-black font-mono text-xs py-3 uppercase tracking-widest font-bold hover:bg-zinc-200">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = drawerHTML;
  document.body.appendChild(div);

  // Bind cart events after DOM injection
  setupDrawerListeners();
}

function bindCartEvents() {
  document.querySelectorAll('.open-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
}

function setupDrawerListeners() {
  const container = document.getElementById('cart-drawer-container');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  const closeBtn = document.getElementById('close-cart-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeCartDrawer);
  }

  // Promo code
  const promoBtn = document.getElementById('apply-promo-btn');
  if (promoBtn) {
    promoBtn.addEventListener('click', applyPromoCode);
  }

  // WhatsApp checkout
  const waBtn = document.getElementById('whatsapp-checkout-btn');
  if (waBtn) {
    waBtn.addEventListener('click', handleWhatsAppCheckout);
  }

  // Standard Checkout modal
  const checkoutBtn = document.getElementById('standard-checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-modal-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const successModal = document.getElementById('order-success-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (STATE.cart.length === 0) {
        showToast("Your cart is empty");
        return;
      }
      closeCartDrawer();
      const subtotalLKR = calculateSubtotalLKR();
      const totalLKR = calculateFinalTotalLKR();
      const totalUSD = Math.round(totalLKR * STATE.exchangeRateUSD);
      document.getElementById('modal-final-total').textContent = formatPrice(totalLKR, totalUSD);
      checkoutModal.classList.remove('hidden');
      checkoutModal.classList.add('flex');
    });
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
      checkoutModal.classList.remove('flex');
    });
  }

  // Toggle card input
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const cardBox = document.getElementById('card-details-box');
      if (cardBox) {
        if (e.target.value === 'card') {
          cardBox.classList.remove('hidden');
        } else {
          cardBox.classList.add('hidden');
        }
      }
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomOrder = 'INEJ-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('success-order-id').textContent = '#' + randomOrder;
      checkoutModal.classList.add('hidden');
      checkoutModal.classList.remove('flex');
      
      // Clear cart
      STATE.cart = [];
      saveCart();
      updateHeaderBadges();
      renderCartItems();

      successModal.classList.remove('hidden');
      successModal.classList.add('flex');
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

function openCartDrawer() {
  const container = document.getElementById('cart-drawer-container');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');

  if (!container || !panel) return;

  renderCartItems();
  container.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0', 'invisible');
  backdrop.classList.add('opacity-100', 'visible');
  panel.classList.remove('translate-x-full');
  panel.classList.add('translate-x-0');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const container = document.getElementById('cart-drawer-container');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');

  if (!container || !panel) return;

  backdrop.classList.remove('opacity-100', 'visible');
  backdrop.classList.add('opacity-0', 'invisible');
  panel.classList.remove('translate-x-0');
  panel.classList.add('translate-x-full');
  setTimeout(() => {
    container.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }, 300);
}

// Calculate totals
function calculateSubtotalLKR() {
  return STATE.cart.reduce((sum, item) => sum + (item.priceLKR * item.quantity), 0);
}

function calculateFinalTotalLKR() {
  let subtotal = calculateSubtotalLKR();
  if (STATE.appliedDiscount) {
    if (STATE.appliedDiscount.type === 'percent') {
      subtotal -= subtotal * (STATE.appliedDiscount.value / 100);
    } else if (STATE.appliedDiscount.type === 'fixed_lkr') {
      subtotal = Math.max(0, subtotal - STATE.appliedDiscount.value);
    }
  }
  return subtotal;
}

// Render cart items inside drawer
function renderCartItems() {
  const wrapper = document.getElementById('cart-items-wrapper');
  if (!wrapper) return;

  if (STATE.cart.length === 0) {
    wrapper.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center space-y-4">
        <svg class="w-12 h-12 text-zinc-600 stroke-[1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <div>
          <p class="text-sm font-brand tracking-widest text-zinc-300">YOUR CART IS EMPTY</p>
          <p class="text-xs text-zinc-500 font-mono mt-1">Solitude Drop 01 is currently live.</p>
        </div>
        <a href="shop.html" onclick="closeCartDrawer()" class="inline-block mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs px-5 py-2.5 uppercase tracking-wider transition-colors">
          Browse Collection
        </a>
      </div>
    `;
    updateCartTotals(0);
    return;
  }

  let html = '';
  STATE.cart.forEach(item => {
    const itemTotalLKR = item.priceLKR * item.quantity;
    const itemTotalUSD = (item.priceUSD || 0) * item.quantity;

    html += `
      <div class="flex gap-4 p-3 bg-zinc-900/40 border border-zinc-800/80 group">
        <div class="w-20 h-24 bg-zinc-950 flex-shrink-0 overflow-hidden relative border border-zinc-800">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <h4 class="text-xs font-semibold text-zinc-200 font-brand tracking-wide">${item.name}</h4>
              <button onclick="removeFromCart('${item.id}', '${item.size}')" class="text-zinc-500 hover:text-red-400 p-1 transition-colors" title="Remove">
                ✕
              </button>
            </div>
            <p class="text-[11px] text-zinc-400 font-mono mt-0.5">SIZE: <span class="text-white font-bold">${item.size}</span> | ${item.color}</p>
          </div>

          <div class="flex justify-between items-center mt-3">
            <!-- Stepper -->
            <div class="flex items-center border border-zinc-700 bg-zinc-950">
              <button onclick="updateQuantity('${item.id}', '${item.size}', -1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-mono text-xs">-</button>
              <span class="w-7 text-center font-mono text-xs text-white">${item.quantity}</span>
              <button onclick="updateQuantity('${item.id}', '${item.size}', 1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-mono text-xs">+</button>
            </div>
            <span class="text-xs font-mono font-bold text-white">${formatPrice(itemTotalLKR, itemTotalUSD)}</span>
          </div>
        </div>
      </div>
    `;
  });

  wrapper.innerHTML = html;
  updateCartTotals();
}

function updateCartTotals() {
  const subtotalLKR = calculateSubtotalLKR();
  const subtotalUSD = Math.round(subtotalLKR * STATE.exchangeRateUSD);
  const finalLKR = calculateFinalTotalLKR();
  const finalUSD = Math.round(finalLKR * STATE.exchangeRateUSD);

  const subtotalEl = document.getElementById('cart-subtotal-price');
  const totalEl = document.getElementById('cart-total-price');
  const shippingEl = document.getElementById('cart-shipping-price');
  const progressBar = document.getElementById('shipping-progress-bar');
  const shippingText = document.getElementById('shipping-amount-needed');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotalLKR, subtotalUSD);
  if (totalEl) totalEl.textContent = formatPrice(finalLKR, finalUSD);

  // Free shipping threshold: Rs. 20,000 / $65
  const freeShippingThreshold = 20000;
  if (progressBar && shippingText) {
    if (subtotalLKR >= freeShippingThreshold) {
      progressBar.style.width = '100%';
      shippingText.textContent = 'FREE EXPRESS SHIPPING UNLOCKED!';
      shippingText.className = 'text-emerald-400 font-bold';
      if (shippingEl) shippingEl.textContent = 'FREE';
    } else {
      const percentage = Math.min(100, Math.round((subtotalLKR / freeShippingThreshold) * 100));
      progressBar.style.width = `${percentage}%`;
      const diff = freeShippingThreshold - subtotalLKR;
      shippingText.textContent = `Add ${formatPrice(diff)} more for FREE SHIPPING`;
      shippingText.className = 'text-zinc-400';
      if (shippingEl) shippingEl.textContent = 'Calculated at checkout';
    }
  }

  // Handle applied discount display
  const discountRow = document.getElementById('discount-row');
  const discountLabel = document.getElementById('discount-label');
  const discountAmount = document.getElementById('discount-amount');

  if (STATE.appliedDiscount && discountRow) {
    discountRow.classList.remove('hidden');
    discountLabel.textContent = `Discount (${STATE.appliedDiscount.code})`;
    const discountVal = subtotalLKR - finalLKR;
    discountAmount.textContent = `-${formatPrice(discountVal, Math.round(discountVal * STATE.exchangeRateUSD))}`;
  } else if (discountRow) {
    discountRow.classList.add('hidden');
  }
}

// Promo Code Logic
function applyPromoCode() {
  const input = document.getElementById('promo-input');
  const status = document.getElementById('promo-status');
  if (!input || !status) return;

  const code = input.value.trim().toUpperCase();
  if (!code) return;

  if (PROMO_CODES[code]) {
    STATE.appliedDiscount = { ...PROMO_CODES[code], code };
    localStorage.setItem('inej_discount', JSON.stringify(STATE.appliedDiscount));
    status.textContent = `Promo '${code}' applied successfully!`;
    status.className = 'text-xs font-mono text-emerald-400 block';
    updateCartTotals();
    showToast(`Code ${code} Applied!`);
  } else {
    status.textContent = 'Invalid promo code. Try SOLITUDE10';
    status.className = 'text-xs font-mono text-red-400 block';
  }
}

// WhatsApp Direct Checkout Generator
function handleWhatsAppCheckout() {
  if (STATE.cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  const finalLKR = calculateFinalTotalLKR();
  const subtotalLKR = calculateSubtotalLKR();
  const isFreeShipping = subtotalLKR >= 20000;

  let msg = `*INEJ STUDIOS // MERCH ORDER*\n`;
  msg += `*Collection 01: SOLITUDE*\n`;
  msg += `------------------------------\n`;
  
  STATE.cart.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.name}*\n`;
    msg += `   • Size: ${item.size}\n`;
    msg += `   • Qty: ${item.quantity}\n`;
    msg += `   • Price: Rs. ${(item.priceLKR * item.quantity).toLocaleString()}\n`;
  });

  msg += `------------------------------\n`;
  msg += `*Subtotal:* Rs. ${subtotalLKR.toLocaleString()}\n`;
  if (STATE.appliedDiscount) {
    msg += `*Promo (${STATE.appliedDiscount.code}):* Applied\n`;
  }
  msg += `*Delivery:* ${isFreeShipping ? 'FREE (Islandwide)' : 'Standard Delivery (Rs. 450)'}\n`;
  msg += `*Estimated Total:* Rs. ${(finalLKR + (isFreeShipping ? 0 : 450)).toLocaleString()}\n\n`;
  msg += `Please send me payment instructions (Bank Transfer / Koko Pay / COD) and confirmation!`;

  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${STATE.whatsappNumber}?text=${encoded}`;
  window.open(waUrl, '_blank');
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

// Wishlist Logic
function toggleWishlist(productId) {
  const index = STATE.wishlist.indexOf(productId);
  if (index > -1) {
    STATE.wishlist.splice(index, 1);
    showToast("Removed from wishlist");
  } else {
    STATE.wishlist.push(productId);
    showToast("Saved to wishlist");
  }
  localStorage.setItem('inej_wishlist', JSON.stringify(STATE.wishlist));
  updateHeaderBadges();
  window.dispatchEvent(new CustomEvent('wishlistChanged', { detail: { wishlist: STATE.wishlist } }));
}

function isInWishlist(productId) {
  return STATE.wishlist.includes(productId);
}
