export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), delay);
  };
}

export function createElement(tag, className, html) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  return el;
}

export function safeJSONParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}
