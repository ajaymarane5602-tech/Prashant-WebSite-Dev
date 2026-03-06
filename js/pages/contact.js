import { CONFIG } from '../config.js';

document.addEventListener('DOMContentLoaded', () => {
  const phoneLink = document.getElementById('contact-phone');
  const whatsappLink = document.getElementById('contact-whatsapp');
  const emailLink = document.getElementById('contact-email');
  const whatsappCta = document.getElementById('whatsapp-cta');
  const facebookCta = document.getElementById('facebook-cta');

  if (phoneLink) {
    phoneLink.textContent = CONFIG.supportPhone;
    phoneLink.href = `tel:${CONFIG.supportPhone.replace(/\s+/g, '')}`;
  }

  if (emailLink) {
    emailLink.textContent = CONFIG.supportEmail;
    emailLink.href = `mailto:${CONFIG.supportEmail}`;
  }

  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}`;
  if (whatsappLink) {
    whatsappLink.textContent = CONFIG.whatsappNumber;
    whatsappLink.href = waUrl;
  }
  if (whatsappCta) {
    whatsappCta.href = `${waUrl}?text=${encodeURIComponent('Hello Vandika Harvest! I would like to know more about your products.')}`;
  }
  if (facebookCta) {
    facebookCta.href = CONFIG.facebookPageUrl;
  }
});
