let productsCachePromise;

const PRODUCT_PATHS = ['/data/products.json', './data/products.json', 'data/products.json'];

function isValidProduct(product) {
  return (
    product &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    Array.isArray(product.images)
  );
}

async function fetchFromFirstAvailablePath() {
  let lastError = new Error('Unable to load products');
  for (const path of PRODUCT_PATHS) {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) continue;
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function fetchProducts() {
  if (!productsCachePromise) {
    productsCachePromise = fetchFromFirstAvailablePath()
      .then((products) => {
        if (!Array.isArray(products)) {
          throw new Error('Products payload is invalid');
        }
        return products.filter(isValidProduct);
      })
      .catch((error) => {
        console.error('Product data fetch failed', error);
        throw error;
      });
  }
  return productsCachePromise;
}

export async function getAllProducts() {
  return fetchProducts();
}

export async function getProductById(id) {
  if (!id) return null;
  const products = await fetchProducts();
  return products.find((product) => product.id === id) || null;
}

export async function getCategories() {
  const products = await fetchProducts();
  const categories = new Set(products.map((product) => product.category));
  return ['All', ...Array.from(categories)];
}
