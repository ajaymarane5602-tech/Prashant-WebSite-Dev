const HALDI_TYPES = [
  {
    key: 'yellow',
    name: 'Yellow Haldi',
    note: 'Most common culinary turmeric with warm color and earthy aroma.',
    image: '/assets/img/yellow-haldi.jpg'
  },
  {
    key: 'white',
    name: 'White Haldi',
    note: 'Mild and aromatic variety, often used in wellness and traditional blends.',
    image: '/assets/img/white_haldi_in_solid_form_480x480.webp'
  },
  {
    key: 'black',
    name: 'Black Haldi',
    note: 'Rare turmeric type known for strong medicinal and ritual usage.',
    image: '/assets/img/black-haldi.jpg'
  }
];

const AUTO_MS = 2000;

function getSlidesPerView() {
  return 1;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  const categoryList = document.getElementById('category-list');
  const carousel = document.getElementById('category-carousel');
  const viewport = carousel?.querySelector('.category-viewport');
  const prevBtn = document.getElementById('category-prev');
  const nextBtn = document.getElementById('category-next');
  const dots = document.getElementById('category-dots');
  if (!categoryList) return;

  const haldiTypes = HALDI_TYPES;
  if (!haldiTypes.length) {
    categoryList.innerHTML = '<li class="error">No haldi types available right now.</li>';
    return;
  }

  categoryList.innerHTML = haldiTypes
    .map(
      (item) => `
        <li class="category-slide">
          <a class="type-${escapeHtml(item.key)}" href="/products.html?category=${encodeURIComponent('Turmeric (Haldi)')}" aria-label="View ${escapeHtml(item.name)} products">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />
            <div class="category-slide-content">
              <p class="category-slide-kicker">Haldi Type</p>
              <p class="category-slide-label">${escapeHtml(item.name)}</p>
              <p class="category-slide-note">${escapeHtml(item.note)}</p>
            </div>
          </a>
        </li>
      `
    )
    .join('');

  if (!carousel || !viewport || !prevBtn || !nextBtn || !dots) return;
  const slides = Array.from(categoryList.querySelectorAll('.category-slide'));
  let index = 0;
  let autoTimer;
  let touchStartX = 0;
  let touchDeltaX = 0;

  function getMaxIndex() {
    const perView = getSlidesPerView();
    return Math.max(0, slides.length - perView);
  }

  function renderDots() {
    const maxIndex = getMaxIndex();
    dots.innerHTML = Array.from({ length: maxIndex + 1 }, (_, dotIndex) => {
      const isActive = dotIndex === index;
      return `<button type="button" class="carousel-dot${isActive ? ' active' : ''}" data-index="${dotIndex}" aria-label="Go to slide ${dotIndex + 1}" ${isActive ? 'aria-current="true"' : ''}></button>`;
    }).join('');
  }

  function updateCarousel() {
    const perView = getSlidesPerView();
    carousel.style.setProperty('--slides-per-view', String(perView));
    index = Math.min(index, getMaxIndex());
    const firstSlide = slides[0];
    const gap = parseFloat(getComputedStyle(categoryList).gap || '0');
    const slideStep = firstSlide ? firstSlide.getBoundingClientRect().width + gap : 0;
    categoryList.style.transform = `translateX(-${index * slideStep}px)`;

    slides.forEach((slide) => slide.classList.remove('is-active'));
    const active = slides[index];
    if (active) active.classList.add('is-active');

    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= getMaxIndex();
    renderDots();
  }

  function stopAuto() {
    if (!autoTimer) return;
    window.clearInterval(autoTimer);
    autoTimer = undefined;
  }

  function startAuto() {
    stopAuto();
    if (getMaxIndex() <= 0) return;
    autoTimer = window.setInterval(() => {
      index = index >= getMaxIndex() ? 0 : index + 1;
      updateCarousel();
    }, AUTO_MS);
  }

  function goPrev() {
    index = Math.max(0, index - 1);
    updateCarousel();
  }

  function goNext() {
    index = Math.min(getMaxIndex(), index + 1);
    updateCarousel();
  }

  prevBtn.addEventListener('click', () => {
    goPrev();
    startAuto();
  });

  nextBtn.addEventListener('click', () => {
    goNext();
    startAuto();
  });

  dots.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const nextIndex = Number(target.dataset.index);
    if (Number.isNaN(nextIndex)) return;
    index = Math.min(getMaxIndex(), Math.max(0, nextIndex));
    updateCarousel();
    startAuto();
  });

  viewport.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchmove',
    (event) => {
      const currentX = event.touches[0]?.clientX ?? touchStartX;
      touchDeltaX = currentX - touchStartX;
    },
    { passive: true }
  );

  viewport.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) < 40) return;
    if (touchDeltaX > 0) {
      goPrev();
    } else {
      goNext();
    }
    startAuto();
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
  startAuto();
});
