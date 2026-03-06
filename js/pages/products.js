import { getAllProducts } from '../products.service.js';
import { createProductCard } from '../components.js';
import { debounce } from '../utils.js';

const state = {
  products: [],
  search: ''
};

const container = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const resultCount = document.getElementById('product-result-count');
const emptyState = document.getElementById('product-empty-state');

async function init() {
  if (!container) return;
  try {
    const products = await getAllProducts();
    state.products = products;
    render();
  } catch (error) {
    container.innerHTML = '<p class="error">Unable to load products at the moment.</p>';
  }
}

function filterProducts() {
  return state.products
    .filter((product) => {
      const query = state.search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query);
      return matchesSearch;
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

function render() {
  if (!container) return;
  const filtered = filterProducts();
  container.innerHTML = '';
  if (resultCount) {
    resultCount.textContent = `${filtered.length} products`;
  }
  if (!filtered.length) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  filtered.forEach((product) => container.appendChild(createProductCard(product)));
}

if (searchInput) {
  searchInput.addEventListener(
    'input',
    debounce((event) => {
      state.search = event.target.value;
      render();
    }, 250)
  );
}

init();
