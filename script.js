/* =========================================================
   Antonio's Airpods+  —  Shared JS
   - Product catalog (single source of truth)
   - Shop rendering + filtering
   - Cart (localStorage) + drawer
   - Nav / mobile menu / active link
   - Contact form validation
   ========================================================= */

/* ---------- Currency helper ---------- */
function formatUGX(amount) {
  return "UGX " + Number(amount).toLocaleString("en-US");
}

/* ---------- Product catalog ----------
   Real brand names, spread across budget → premium tiers.
   Prices in Ugandan Shillings (UGX).
*/
const PRODUCTS = [
  {
    id: "oraimo-freepods-4",
    name: "Oraimo FreePods 4",
    category: "earbuds",
    categoryLabel: "Wireless Earbuds",
    price: 120000,
    image: "public/images/earbuds-onyx.jpg",
    color: "Matte Black",
    swatches: ["#1a1a1a", "#f5f1ea"],
    tag: "Best Seller",
  },
  {
    id: "airpods-pro-2",
    name: "Apple AirPods Pro (2nd Gen)",
    category: "earbuds",
    categoryLabel: "Wireless Earbuds",
    price: 850000,
    image: "public/images/earbuds-ivory.jpg",
    color: "White",
    swatches: ["#f5f1ea"],
    tag: "New",
  },
  {
    id: "jbl-tune-770nc",
    name: "JBL Tune 770NC",
    category: "headphones",
    categoryLabel: "Over-Ear Headphones",
    price: 480000,
    image: "public/images/headphones-midnight.jpg",
    color: "Midnight Black",
    swatches: ["#1a1a1a", "#d4c4a8"],
  },
  {
    id: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    category: "headphones",
    categoryLabel: "Over-Ear Headphones",
    price: 1450000,
    image: "public/images/headphones-champagne.jpg",
    color: "Silver",
    swatches: ["#d4c4a8", "#1a1a1a"],
    tag: "Editor's Pick",
  },
  {
    id: "airpods-max",
    name: "Apple AirPods Max",
    category: "pods",
    categoryLabel: "Premium Audio Pods",
    price: 2800000,
    image: "public/images/pods-spacegray.jpg",
    color: "Space Gray",
    swatches: ["#4a4a4a", "#d9c9b3"],
  },
  {
    id: "bose-qc-ultra",
    name: "Bose QuietComfort Ultra",
    category: "pods",
    categoryLabel: "Premium Audio Pods",
    price: 1650000,
    image: "public/images/pods-sand.jpg",
    color: "Sandstone",
    swatches: ["#d9c9b3", "#4a4a4a"],
  },
  {
    id: "marshall-emberton-ii",
    name: "Marshall Emberton II",
    category: "speakers",
    categoryLabel: "Bluetooth Speaker",
    price: 520000,
    image: "public/images/speaker-charcoal.jpg",
    color: "Black & Brass",
    swatches: ["#3a3a3a", "#c26a3f"],
  },
  {
    id: "jbl-flip-6",
    name: "JBL Flip 6",
    category: "speakers",
    categoryLabel: "Bluetooth Speaker",
    price: 350000,
    image: "public/images/speaker-terracotta.jpg",
    color: "Squad Orange",
    swatches: ["#c26a3f", "#3a3a3a"],
    tag: "Budget Pick",
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
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-cart-overlay]")?.classList.remove("visible");
  document.body.style.overflow = "";
}

function renderCartDrawer() {
  const body = document.querySelector("[data-cart-body]");
  const totalEl = document.querySelector("[data-cart-total]");
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    if (totalEl) totalEl.textContent = formatUGX(0);
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
            <div class="qty">${formatUGX(p.price * item.qty)}</div>
          </div>
          <button class="cart-item-remove" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button>
        </div>
      `;
    })
    .join("");

  if (totalEl) totalEl.textContent = formatUGX(cartTotal());

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
        <span class="product-price">${formatUGX(p.price)}</span>
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
  if (opts.category && opts.category !== "all") {
    list = list.filter((p) => p.category === opts.category);
  }
  if (opts.limit) list = list.slice(0, opts.limit);

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
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    // Close mobile menu when a link is clicked
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
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
