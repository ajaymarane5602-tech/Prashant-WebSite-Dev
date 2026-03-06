import { getProductById } from '../products.service.js';
import { CONFIG } from '../config.js';
import { formatCurrency, getQueryParam } from '../utils.js';

const container = document.getElementById('product-detail');

async function init() {
  if (!container) return;
  const productId = getQueryParam('id');
  if (!productId) {
    container.innerHTML = '<p class="error">Product not found.</p>';
    return;
  }
  try {
    const product = await getProductById(productId);
    if (!product) {
      container.innerHTML = '<p class="error">Product not found.</p>';
      return;
    }

    const specsMarkup = buildSpecsMarkup(product.specs);
    const highlightsMarkup = buildHighlightsMarkup(product.specs);
    const productImages = product.images?.length ? product.images : ['/assets/img/turmeric-classic.svg'];
    const whatsappMessage = [
      'Hello Vandika Harvest!',
      `I want to order: ${product.name}`,
      `Price: ${formatCurrency(product.price)}`,
      `Product Link: ${window.location.href}`
    ].join('\n');
    const whatsappHref = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    container.innerHTML = `
      <div class="detail-gallery">
        <div class="detail-image-stage">
          <img class="detail-main-image" src="${productImages[0]}" alt="${product.name} main image" loading="eager" />
        </div>
        <div class="detail-thumbs">
          ${productImages
            .map(
              (src, index) => `
                <button class="detail-thumb ${index === 0 ? 'is-active' : ''}" type="button" data-src="${src}" aria-label="View ${product.name} image ${index + 1}">
                  <img src="${src}" alt="${product.name} thumbnail ${index + 1}" loading="lazy" />
                </button>`
            )
            .join('')}
        </div>
      </div>
      <div class="detail-content">
        <p class="product-category">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="product-desc">${product.longDescription}</p>
        <div class="product-highlights">${highlightsMarkup}</div>
        <p class="price">${formatCurrency(product.price)}</p>
        <div class="product-actions">
          <a class="btn btn-whatsapp" href="${whatsappHref}" target="_blank" rel="noopener">Order on WhatsApp</a>
          <a class="btn btn-outline" href="/products.html">Explore More Products</a>
        </div>
        <dl class="specs">${specsMarkup}</dl>
      </div>`;

    const fallbackImage = '/assets/img/turmeric-classic.svg';
    container.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => {
        img.src = fallbackImage;
      });
    });

    setupGalleryInteraction();
  } catch (error) {
    container.innerHTML = '<p class="error">Product not found.</p>';
  }
}

function buildSpecsMarkup(specs) {
  if (Array.isArray(specs)) {
    return specs.map((item, index) => `<div><dt>Spec ${index + 1}</dt><dd>${item}</dd></div>`).join('');
  }
  if (specs && typeof specs === 'object') {
    return Object.entries(specs)
      .map((entry) => `<div><dt>${entry[0]}</dt><dd>${entry[1]}</dd></div>`)
      .join('');
  }
  return '<div><dt>Details</dt><dd>Product specifications will be updated soon.</dd></div>';
}

function buildHighlightsMarkup(specs) {
  if (!specs) return '';
  const entries = Array.isArray(specs)
    ? specs.slice(0, 3).map((value, index) => [`Detail ${index + 1}`, value])
    : Object.entries(specs).slice(0, 3);
  return entries.map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('');
}

function setupGalleryInteraction() {
  const mainImage = container.querySelector('.detail-main-image');
  const thumbButtons = container.querySelectorAll('.detail-thumb');
  if (!(mainImage instanceof HTMLImageElement) || !thumbButtons.length) return;

  thumbButtons.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const nextSrc = thumb.getAttribute('data-src');
      if (!nextSrc) return;
      mainImage.src = nextSrc;
      thumbButtons.forEach((button) => button.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });
}

init();
