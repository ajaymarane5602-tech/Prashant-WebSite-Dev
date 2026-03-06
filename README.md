# Vandika Harvest Static Catalog

A production-ready static product catalog for Vandika Harvest, showcasing premium spices and kitchen essentials with direct WhatsApp and email enquiry flows.

## Highlights
- Multi-page HTML website (Home, Products, Product Details, Feedbacks, Contact, About, Certifications)
- Product data driven entirely via `/data/products.json`
- Responsive product grid with search, category filter, and sorting
- Direct product enquiries through WhatsApp buttons (no online checkout/cart)
- Contact page with phone, WhatsApp, email, and Facebook page link
- Vanilla JavaScript ES modules, no frameworks

## VS Code Setup & Local Run Checklist
### A. Must-have installs
1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Recommended extensions:
   - Live Server (by Ritwick Dey)
   - Prettier
   - ESLint (optional, for linting plain JS)

### B. Verify Node.js inside VS Code terminal
Run inside the project folder:
```bash
node -v
npm -v
```
If the commands print versions (v18/v20 etc.), everything is good. If not, install the latest Node.js LTS release.

### C. Run locally
- **Option 1 – Live Server**
  1. Open the folder in VS Code
  2. Right-click `index.html` → "Open with Live Server"
- **Option 2 – Node-based static server (recommended when fetch fails on `file://`)**
  ```bash
  npx serve .
  ```
  Open the URL printed in the console (usually http://localhost:3000)

### D. Quick functional test
1. Open `index.html`: confirm hero banner and home sections render
2. Visit `products.html`: search “haldi” and switch categories
3. Open any product detail page: gallery + specs show
4. Click product **Order on WhatsApp** buttons: WhatsApp opens with prefilled product enquiry
5. Open `contact.html`: phone, WhatsApp, email, and Facebook links work
6. Open `feedbacks.html`: filtering/sorting controls work and WhatsApp feedback CTA opens correctly

## Project Structure
```
.
├── index.html
├── products.html
├── product.html
├── feedbacks.html
├── about.html
├── certifications.html
├── contact.html
├── assets
│   ├── css/styles.css
│   └── img/*
├── data/products.json
└── js
    ├── config.js
    ├── utils.js
    ├── products.service.js
    ├── components.js
    └── pages/
        ├── home.js
        ├── products.js
        ├── product.js
        ├── feedbacks.js
        └── contact.js
```

## Implementation Notes
- `products.service.js` fetches `/data/products.json` once and caches the promise for reuse.
- `components.js` injects shared header/footer and exports `createProductCard` used by pages.
- Product cards and product detail page use direct WhatsApp enquiry links with prefilled message text.
- WhatsApp number, phone, email, and Facebook URL are configured in `js/config.js`.

## Verification Checklist
- [ ] VS Code installed with Live Server + Prettier (ESLint optional)
- [ ] `node -v` and `npm -v` run successfully in VS Code terminal
- [ ] Local server running via Live Server or `npx serve .`
- [ ] Hero, categories, and featured sections visible on `index.html`
- [ ] Filters/search functional on `products.html`
- [ ] Product page renders gallery/specs and WhatsApp enquiry CTA (`product.html?id=...`)
- [ ] Contact page links (phone/WhatsApp/email/Facebook) open correctly
- [ ] Feedbacks page filter/sort and WhatsApp CTA work
