import { CONFIG } from './config.js';
import { formatCurrency } from './utils.js';

const NAV_LINKS = [
  { href: '/index.html', label: 'Home', key: 'home' },
  { href: '/products.html', label: 'Products', key: 'products' },
  { href: '/about.html', label: 'About', key: 'about' },
  { href: '/contact.html', label: 'Contact', key: 'contact' }
];

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const activePage = document.body.dataset.page;
  header.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="container nav-bar">
      <a class="logo" href="/index.html">${CONFIG.brandName}</a>
      <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      <nav id="primary-nav" aria-label="Main navigation">
        <ul>
          ${NAV_LINKS.map(
            (link) => `
              <li>
                <a class="${activePage === link.key ? 'active' : ''}" href="${link.href}" ${
                  activePage === link.key ? 'aria-current="page"' : ''
                }>
                  ${link.label}
                </a>
              </li>`
          ).join('')}
        </ul>
      </nav>
      <div class="header-actions">
        <div class="lang-switcher">
          <button class="btn btn-muted lang-btn" id="lang-toggle" type="button" aria-expanded="false" aria-controls="lang-menu">
            Language
          </button>
          <div class="lang-menu" id="lang-menu" hidden>
            <div id="google_translate_element"></div>
          </div>
        </div>
        <a class="btn btn-primary" href="/products.html">Shop Now</a>
      </div>
    </div>`;

  setupMobileNav();
  setupLanguageSwitcher();
  initTranslateWidget();
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container footer">
      <div class="footer-brand">
        <p class="footer-kicker">Vandika Promise</p>
        <h3>${CONFIG.brandName}</h3>
        <p>Authentic spices crafted in small batches.</p>
      </div>
      <div class="footer-contact">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${CONFIG.supportPhone.replace(/\s+/g, '')}">${CONFIG.supportPhone}</a></li>
          <li><a href="mailto:${CONFIG.supportEmail}">${CONFIG.supportEmail}</a></li>
          <li>${CONFIG.address}</li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          ${NAV_LINKS.slice(0, 5)
            .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
            .join('')}
        </ul>
      </div>
    </div>
    <div class="sub-footer">© ${new Date().getFullYear()} ${CONFIG.brandName}. All rights reserved.</div>`;
}

export function createProductCard(product) {
  const article = document.createElement('article');
  const fallbackImage = '/assets/img/turmeric-classic.svg';
  const productImage = product.images[0] || fallbackImage;
  const whatsappMessage = [
    'Hello Vandika Harvest!',
    `I want to order: ${product.name}`,
    `Price: ${formatCurrency(product.price)}`,
    `Product Link: ${window.location.origin}/product.html?id=${encodeURIComponent(product.id)}`
  ].join('\n');
  const whatsappHref = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
  article.className = 'product-card reveal-up';
  article.innerHTML = `
    <a class="product-thumb" href="/product.html?id=${product.id}">
      <img src="${productImage}" alt="${product.name}" loading="lazy" />
    </a>
    <div class="product-content">
      <h3><a href="/product.html?id=${product.id}">${product.name}</a></h3>
      <div class="product-price-row">
        <span class="price">${formatCurrency(product.price)}</span>
      </div>
      <div class="product-cta-row">
        <a class="btn btn-outline" href="/product.html?id=${product.id}">View Details</a>
        <a class="btn btn-whatsapp" href="${whatsappHref}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>`;
  article.querySelector('img').addEventListener('error', (event) => {
    event.currentTarget.src = fallbackImage;
  });

  return article;
}

function setupMobileNav() {
  document.body.classList.add('nav-ready');
  const toggleBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggleBtn || !nav) return;
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
}

function setupLanguageSwitcher() {
  const toggle = document.getElementById('lang-toggle');
  const menu = document.getElementById('lang-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!menu.contains(target) && !toggle.contains(target)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function loadGoogleTranslateScript() {
  if (window.google?.translate?.TranslateElement) {
    renderTranslateElement();
    return;
  }

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = renderTranslateElement;
  }

  if (document.getElementById('google-translate-script')) return;

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);
}

function renderTranslateElement() {
  const container = document.getElementById('google_translate_element');
  if (!container || container.dataset.initialized === 'true') return;
  if (!window.google?.translate?.TranslateElement) return;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      autoDisplay: false
    },
    'google_translate_element'
  );

  container.dataset.initialized = 'true';
  syncLanguagePersistence();
}

function syncLanguagePersistence(attempt = 0) {
  const combo = document.querySelector('#google_translate_element .goog-te-combo');
  if (!(combo instanceof HTMLSelectElement)) {
    if (attempt < 40) {
      window.setTimeout(() => syncLanguagePersistence(attempt + 1), 250);
    }
    return;
  }

  if (!combo.dataset.bound) {
    combo.dataset.bound = 'true';
    combo.addEventListener('change', () => {
      try {
        localStorage.setItem('vh-language', combo.value);
      } catch (error) {
        console.warn('Language preference not saved', error);
      }
    });
  }

  let savedLanguage = '';
  try {
    savedLanguage = localStorage.getItem('vh-language') || '';
  } catch (error) {
    console.warn('Language preference read failed', error);
  }
  if (savedLanguage && combo.value !== savedLanguage) {
    combo.value = savedLanguage;
    combo.dispatchEvent(new Event('change'));
  }
}

function initTranslateWidget() {
  loadGoogleTranslateScript();
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
