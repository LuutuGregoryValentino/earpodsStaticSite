/* =========================================================
   Antonio's Airpods+  —  Shared JS
   - Product catalog (single source of truth)
   - Shop rendering + filtering
   - Cart (localStorage) + drawer
   - Nav / mobile menu / active link
   - Contact form validation
   ========================================================= */

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  {
    id: "aap-onyx",
    name: "Aria Pro",
    category: "earbuds",
    categoryLabel: "Wireless Earbuds",
    price: 249,
    image: "public/images/earbuds-onyx.jpg",
    color: "Onyx",
    swatches: ["#1a1a1a", "#f5f1ea", "#b8926a"],
    tag: "Best Seller",
  },
  {
    id: "aap-ivory",
    name: "Aria Pro",
    category: "earbuds",
    categoryLabel: "Wireless Earbuds",
    price: 249,
    image: "public/images/earbuds-ivory.jpg",
    color: "Ivory",
    swatches: ["#f5f1ea", "#1a1a1a", "#b8926a"],
  },
  {
    id: "hp-midnight",
    name: "Studio One",
    category: "headphones",
    categoryLabel: "Over-Ear Headphones",
    price: 449,
    image: "public/images/headphones-midnight.jpg",
    color: "Midnight",
    swatches: ["#1a1a1a", "#d4c4a8"],
    tag: "New",
  },
  {
    id: "hp-champagne",
    name: "Studio One",
    category: "headphones",
    categoryLabel: "Over-Ear Headphones",
    price: 449,
    image: "public/images/headphones-champagne.jpg",
    color: "Champagne",
    swatches: ["#d4c4a8", "#1a1a1a"],
  },
  {
    id: "pod-gray",
    name: "Halo Pods",
    category: "pods",
    categoryLabel: "Premium Audio Pods",
    price: 599,
    image: "public/images/pods-spacegray.jpg",
    color: "Space Gray",
    swatches: ["#4a4a4a", "#d9c9b3"],
  },
  {
    id: "pod-sand",
    name: "Halo Pods",
    category: "pods",
    categoryLabel: "Premium Audio Pods",
    price: 599,
    image: "public/images/pods-sand.jpg",
    color: "Sand",
    swatches: ["#d9c9b3", "#4a4a4a"],
  },
  {
    id: "spk-charcoal",
    name: "Resonance 01",
    category: "speakers",
    categoryLabel: "Bluetooth Speaker",
    price: 329,
    image: "public/images/speaker-charcoal.jpg",
    color: "Charcoal",
    swatches: ["#3a3a3a", "#c26a3f"],
  },
  {
    id: "spk-terracotta",
    name: "Resonance 01",
    category: "speakers",
    categoryLabel: "Bluetooth Speaker",
    price: 329,
    image: "public/images/speaker-terracotta.jpg",
    color: "Terracotta",
    swatches: ["#c26a3f", "#3a3a3a"],
    tag: "Limited",
  },
];

/* ---------- Cart store (localStorage) ---------- */
const CART_KEY = "aap_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, i) => {
    const p = PRODUCTS.find((p) => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function updateCartCount() {
  const el = document.querySelector("[data-cart-count]");
  if (el) el.textContent = cartCount();
}

/* ---------- Cart drawer ---------- */
function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("open");
  document.querySelector("[data-cart-overlay]")?.classList.add("visible");
}

function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-cart-overlay]")?.classList.remove("visible");
}

function renderCartDrawer() {
  const body = document.querySelector("[data-cart-body]");
  const totalEl = document.querySelector("[data-cart-total]");
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    if (totalEl) totalEl.textContent = "$0";
    return;
  }

  body.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((p) => p.id === item.id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-item-info">
            <div class="name">${p.name}</div>
            <div class="qty">${p.color} · Qty ${item.qty}</div>
            <div class="qty">$${(p.price * item.qty).toLocaleString()}</div>
          </div>
          <button class="cart-item-remove" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button>
        </div>
      `;
    })
    .join("");

  if (totalEl) totalEl.textContent = "$" + cartTotal().toLocaleString();

  body.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeFromCart(e.currentTarget.getAttribute("data-remove"));
    });
  });
}

/* ---------- Product rendering ---------- */
function productCardHTML(p) {
  const swatches = p.swatches
    .map(
      (c) =>
        `<span class="swatch" style="background:${c}" aria-label="color"></span>`
    )
    .join("");
  const tag = p.tag ? `<span class="product-tag">${p.tag}</span>` : "";
  return `
    <article class="product-card" data-category="${p.category}">
      <div class="product-image">
        ${tag}
        <img src="${p.image}" alt="${p.name} in ${p.color}">
      </div>
      <div class="product-meta">
        <h3 class="product-name">${p.name}</h3>
        <span class="product-price">$${p.price}</span>
      </div>
      <div class="product-category">${p.categoryLabel} · ${p.color}</div>
      <div class="product-colors">${swatches}</div>
      <button class="add-btn" data-add="${p.id}">Add to Cart</button>
    </article>
  `;
}

function renderProducts(containerSelector, opts = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let list = PRODUCTS.slice();
  if (opts.limit) list = list.slice(0, opts.limit);
  if (opts.category && opts.category !== "all") {
    list = list.filter((p) => p.category === opts.category);
  }

  container.innerHTML = list.map(productCardHTML).join("");

  container.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-add");
      addToCart(id);
      e.currentTarget.textContent = "Added";
      e.currentTarget.classList.add("added");
      setTimeout(() => {
        e.currentTarget.textContent = "Add to Cart";
        e.currentTarget.classList.remove("added");
      }, 1600);
    });
  });
}

/* ---------- Shop filters ---------- */
function initFilters() {
  const filters = document.querySelectorAll("[data-filter]");
  if (!filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-filter");
      renderProducts("[data-product-grid]", { category: cat });
    });
  });
}

/* ---------- Nav ---------- */
function initNav() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // Active link based on pathname
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-links] a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  // Cart drawer open/close
  document.querySelector("[data-cart-open]")?.addEventListener("click", openCart);
  document.querySelector("[data-cart-close]")?.addEventListener("click", closeCart);
  document
    .querySelector("[data-cart-overlay]")
    ?.addEventListener("click", closeCart);
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = form.querySelector("[data-form-success]");
    form.reset();
    if (success) {
      success.classList.add("visible");
      setTimeout(() => success.classList.remove("visible"), 6000);
    }
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  updateCartCount();
  renderCartDrawer();
  initFilters();
  initContactForm();

  // Page-specific rendering
  if (document.querySelector("[data-featured-products]")) {
    renderProducts("[data-featured-products]", { limit: 3 });
  }
  if (document.querySelector("[data-product-grid]")) {
    renderProducts("[data-product-grid]", { category: "all" });
  }

  // Footer year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
