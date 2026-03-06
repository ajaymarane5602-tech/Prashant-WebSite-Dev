import { CONFIG } from '../config.js';

function parseNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('feedback-grid');
  const chips = Array.from(document.querySelectorAll('.feedback-chip'));
  const sortSelect = document.getElementById('feedback-sort');
  const whatsappBtn = document.getElementById('feedback-whatsapp-btn');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.feedback-card'));
  const initialIndex = new Map(cards.map((card, index) => [card, index]));

  let activeFilter = 'all';

  function getVisibleCards() {
    return cards.filter((card) => {
      const category = (card.dataset.category || '').toLowerCase();
      return activeFilter === 'all' || category === activeFilter;
    });
  }

  function applyFilterAndSort() {
    const mode = sortSelect?.value || 'recent';
    const visible = getVisibleCards();

    visible.sort((a, b) => {
      if (mode === 'rating') {
        return parseNum(b.dataset.rating) - parseNum(a.dataset.rating) || parseNum(b.dataset.helpful) - parseNum(a.dataset.helpful);
      }
      if (mode === 'helpful') {
        return parseNum(b.dataset.helpful) - parseNum(a.dataset.helpful) || parseNum(b.dataset.rating) - parseNum(a.dataset.rating);
      }
      if (mode === 'recent') {
        return String(b.dataset.date || '').localeCompare(String(a.dataset.date || ''));
      }
      return (initialIndex.get(a) || 0) - (initialIndex.get(b) || 0);
    });

    cards.forEach((card) => {
      const isVisible = visible.includes(card);
      card.hidden = !isVisible;
    });

    visible.forEach((card) => {
      grid.appendChild(card);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter || 'all';
      activeFilter = filter;

      chips.forEach((item) => {
        const isActive = item === chip;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      applyFilterAndSort();
    });
  });

  sortSelect?.addEventListener('change', applyFilterAndSort);

  if (whatsappBtn) {
    const text = 'Hello Vandika Harvest! I want to share feedback about your products.';
    whatsappBtn.href = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(text)}`;
  }

  applyFilterAndSort();
});
