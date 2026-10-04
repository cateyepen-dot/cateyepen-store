/* Standalone store behaviour: localStorage cart, no Shopify backend. */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  var KEY = 'cateyepen_cart_inr';
  var OWNER_EMAIL = 'cateyepen@gmail.com';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
  function count() {
    return load().reduce(function (a, i) { return a + (i.price === 0 ? 0 : i.qty); }, 0);
  }
  /* ---- prices: the whole store is in Indian rupees (INR) ---- */
  var PEN_PRICE = 799;   /* price of ONE pen - keep equal to PEN_PRICE in netlify/functions/razorpay.js */
  var LAMP_PRICE = 349;  /* standalone mini UV lamp - keep equal to LAMP_PRICE in netlify/functions/razorpay.js */
  function money(n) { return '\u20B9' + Math.round(n).toLocaleString('en-IN'); }
  function parsePrice(text) {
    var m = (text || '').match(/[\d][\d\s.,]*/);
    if (!m) return 0;
    /* display format is always en-US (comma = thousands, dot = decimals) */
    var s = m[0].replace(/\s/g, '').replace(/,/g, '');
    return parseFloat(s) || 0;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* relative prefix to the images/ dir from the current page depth */
  function imgBase() {
    return /\/(products|collections|pages|policies)\//.test(location.pathname)
      ? '../images/' : 'images/';
  }

  /* ---- premium cart drawer, add-to-cart effects, announcement bar ---- */
  var drawerEl = null, overlayEl = null, lastAddedId = null;
  var cartBase = /\/(products|collections|pages|policies)\//.test(location.pathname) ? '../' : '';
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function giftIcon(name) {
    return /warrant/i.test(name) ? '\uD83D\uDEE1\uFE0F' : /lamp|uv/i.test(name) ? '\uD83D\uDD26' : /ship/i.test(name) ? '\uD83D\uDCE6' : '\uD83C\uDF81';
  }
  function cleanGiftName(n) { return String(n).replace(/\s*\(FREE\)\s*$/i, ''); }
  function ensureDrawer() {
    if (drawerEl) return;
    overlayEl = document.createElement('div');
    overlayEl.className = 'cp-drawer-overlay';
    drawerEl = document.createElement('aside');
    drawerEl.className = 'cp-drawer';
    drawerEl.setAttribute('aria-label', 'Your cart');
    drawerEl.innerHTML =
      '<div class="cp-drawer__head"><span class="cp-drawer__title">Your cart<small></small></span>' +
      '<button type="button" class="cp-drawer__close" aria-label="Close cart">&times;</button></div>' +
      '<div class="cp-drawer__items"></div>' +
      '<div class="cp-drawer__foot">' +
        '<div class="cp-drawer__subtotal"><span>Subtotal</span><b class="cp-drawer__total"></b></div>' +
        '<p class="cp-drawer__ship">\u2713 Free delivery across India</p>' +
        '<div class="cp-drawer__btns">' +
          '<a class="cp-btn cp-drawer__checkout" href="' + cartBase + 'checkout.html"><span>Checkout securely</span><i class="cp-btn__arrow">\u2192</i></a>' +
          '<a class="cp-btn cp-btn--ghost" href="' + cartBase + 'cart.html"><span>View cart</span></a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
    drawerEl.querySelector('.cp-drawer__close').addEventListener('click', closeCartDrawer);
    overlayEl.addEventListener('click', closeCartDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCartDrawer(); });
  }
  function renderDrawer() {
    ensureDrawer();
    var items = load();
    var box = drawerEl.querySelector('.cp-drawer__items');
    var paid = items.filter(function (i) { return i.price !== 0; });
    var gifts = items.filter(function (i) { return i.price === 0; });
    box.innerHTML = items.length ? paid.concat(gifts).map(function (i, idx) {
      var isNew = i.id === lastAddedId ? ' is-new' : '';
      if (i.price === 0) {
        return '<div class="cp-dline cp-dline--gift" style="--i:' + idx + '"><span class="gi">' + giftIcon(i.name) + '</span>' +
          '<div class="n">' + esc(cleanGiftName(i.name)) + '</div><span class="cp-free">FREE</span></div>';
      }
      return '<div class="cp-dline' + isNew + '" style="--i:' + idx + '">' +
        (i.img ? '<img src="' + esc(i.img.replace(/^images\//, imgBase())) + '" alt="">' : '') +
        '<div class="n"><b style="font-weight:600">' + esc(i.name) + '</b>' +
          (i.variant ? '<span class="v">Colour: ' + esc(i.variant) + '</span>' : '') +
          '<span class="q">Qty ' + i.qty + '</span></div>' +
        '<div class="p">' + money(i.price * i.qty) + '</div></div>';
    }).join('') : '<div class="cp-drawer__empty"><div style="font-size:44px">\uD83D\uDECD\uFE0F</div><p>Your cart is empty.</p></div>';
    var total = items.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
    drawerEl.querySelector('.cp-drawer__total').textContent = money(total);
    drawerEl.querySelector('.cp-drawer__title small').textContent = items.length ? '(' + count() + ' item' + (count() === 1 ? '' : 's') + ')' : '';
    drawerEl.querySelector('.cp-drawer__foot').style.display = items.length ? '' : 'none';
  }
  function openCartDrawer() {
    renderDrawer();
    drawerEl.classList.add('is-open'); overlayEl.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    if (!drawerEl) return;
    drawerEl.classList.remove('is-open'); overlayEl.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    lastAddedId = null;
  }

  /* cart icon bump + image that flies to the cart + toast */
  function bumpCart() {
    var cartIcon = document.getElementById('cart-icon-bubble');
    if (!cartIcon) return;
    cartIcon.classList.remove('cp-bump');
    void cartIcon.offsetWidth;
    cartIcon.classList.add('cp-bump');
  }
  function flyToCart(srcImg) {
    var icon = document.getElementById('cart-icon-bubble');
    if (!srcImg || !icon || reduceMotion || !srcImg.getBoundingClientRect) return;
    var r = srcImg.getBoundingClientRect(), t = icon.getBoundingClientRect();
    if (!r.width || !t.width) return;
    var size = Math.min(r.width, 180);
    var f = document.createElement('img');
    f.src = srcImg.currentSrc || srcImg.src;
    f.className = 'cp-fly';
    f.style.cssText = 'left:' + (r.left + r.width / 2 - size / 2) + 'px;top:' + (r.top + r.height / 2 - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px';
    document.body.appendChild(f);
    var dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
    var sc = Math.max(.1, 30 / size);
    var anim = f.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.55 - 70) + 'px) scale(' + (sc + .35) + ')', opacity: .95, offset: .55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')', opacity: .15 }
    ], { duration: 780, easing: 'cubic-bezier(.5,0,.2,1)' });
    anim.onfinish = function () { f.remove(); };
  }
  var toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'cp-toast'; document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<i>\u2713</i><span>' + esc(msg) + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }
  function wrapLabel(btn) {
    if (!btn.querySelector('.cp-lbl')) { btn.innerHTML = '<span class="cp-lbl">' + esc(btn.textContent.trim()) + '</span>'; }
    return btn.querySelector('.cp-lbl');
  }
  /* one smooth sequence: button spinner -> flying image -> cart icon bump -> drawer slides in */
  function runAddFx(btn, srcImg, addedId) {
    lastAddedId = addedId || null;
    var lbl = btn ? wrapLabel(btn) : null;
    var old = lbl ? (lbl.getAttribute('data-old') || lbl.textContent) : '';
    if (lbl) lbl.setAttribute('data-old', old);
    if (btn) btn.classList.add('is-loading');
    setTimeout(function () {
      if (btn) { btn.classList.remove('is-loading'); btn.classList.add('is-done'); lbl.textContent = 'Added \u2713'; }
      flyToCart(srcImg);
      setTimeout(function () { updateBubble(); bumpCart(); }, reduceMotion ? 0 : 620);
      setTimeout(openCartDrawer, reduceMotion ? 0 : 760);
      setTimeout(function () { if (btn) { btn.classList.remove('is-done'); lbl.textContent = old; } }, 2400);
    }, reduceMotion ? 0 : 420);
  }

  /* ---- announcement bar (no timer) ---- */
  (function () {
    if (document.querySelector('.cp-announce')) return;
    var bar = document.createElement('div');
    bar.className = 'cp-announce';
    bar.innerHTML = '<div class="cp-announce__inner"><span>Free delivery across India</span><span>Pay securely with UPI, Visa or Mastercard</span></div>';
    document.body.insertBefore(bar, document.body.firstChild);
  })();

  /* ---- header cart bubble ---- */
  function updateBubble() {
    var icon = document.getElementById('cart-icon-bubble');
    if (!icon) return;
    var bubble = icon.querySelector('.cart-count-bubble');
    var n = count();
    if (n === 0) { if (bubble) bubble.remove(); return; }
    if (!bubble) {
      bubble = document.createElement('span');
      bubble.className = 'cart-count-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      icon.appendChild(bubble);
    }
    bubble.innerHTML = '<span>' + n + '</span>';
    bubble.classList.remove('cp-pop'); void bubble.offsetWidth; bubble.classList.add('cp-pop');
  }

  /* ---- corrective styles for badge + cart quantity box ---- */
  (function () {
    var st = document.createElement('style');
    st.textContent =
      '#cart-icon-bubble{position:relative}' +
      '.cart-count-bubble{position:absolute;top:auto;bottom:-6px;right:-8px;left:auto;' +
      'height:20px!important;min-width:20px!important;width:auto!important;padding:0 5px;box-sizing:border-box;' +
      'border-radius:9999px!important;display:flex!important;align-items:center;justify-content:center;' +
      'font-size:12px;font-weight:600;line-height:20px;z-index:6;overflow:hidden;white-space:nowrap;' +
      'background:rgb(var(--color-button));color:rgb(var(--color-button-text))}' +
      '.cart-count-bubble span{line-height:20px;display:block;text-align:center}' +
      '.cart-item__remove-row{margin-top:8px}' +
      '.cart-item__remove-row .button--tertiary{padding:0;min-width:0;min-height:0;height:auto}' +
      '.cart-item .quantity{display:flex;align-items:stretch}' +
      '.cart-item .quantity__input{display:flex;align-items:center;justify-content:center;' +
      'box-sizing:border-box;min-width:44px;height:32px;margin:0;padding:0 4px;' +
      'font-size:15px;font-weight:500;line-height:32px;text-align:center;overflow:hidden}' +
      '.cart-item .quantity__button{width:32px;height:32px;display:flex;' +
      'align-items:center;justify-content:center;flex:0 0 32px}' +
      '.cart-items{display:block!important;width:100%!important;row-gap:0!important}' +
      '.cart-item{display:grid!important;grid-template-columns:96px 1fr auto;gap:16px;' +
      'align-items:start;margin:0 0 20px!important;padding:0 0 20px;border-bottom:1px solid #f3e8ee}' +
      '.cart-item:last-child{margin-bottom:0!important;border-bottom:none}' +
      '.cart-item__media{grid-column:1;grid-row:1;width:96px!important}' +
      '.cart-item__image-container{width:96px;height:96px}' +
      '.cart-item__image{width:96px!important;height:96px;max-width:96px!important;' +
      'object-fit:cover;border-radius:10px}' +
      '.cart-item__details{grid-column:2;grid-row:1;width:auto!important;max-width:none!important;' +
      'display:flex;flex-direction:column;gap:8px;align-items:flex-start}' +
      '.cart-item__details>*+*{margin-top:0!important}' +
      '.cart-item__name{font-size:15px!important;line-height:1.4}' +
      '.cart-item__variant{color:#6f5066;font-size:12.5px}' +
      '.cart-item__quantity{width:max-content!important;padding:0!important;margin:0!important;' +
      'border:1px solid #e8d3df;border-radius:8px;overflow:hidden}' +
      '.cart-item__remove-row{margin-top:2px!important}' +
      '.cart-item__totals{grid-column:3;grid-row:1;justify-content:flex-end;text-align:right;font-weight:700;font-size:15px}' +
      '.cart-item__totals .totals__subtotal-value{margin:0;font-weight:700}';
    document.head.appendChild(st);
  })();

  /* ---- add to cart ---- */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    var kind = form.getAttribute('data-standalone');
    if (kind === 'add') {
      e.preventDefault();
      var idInput = form.querySelector('.product-variant-id') || form.querySelector('input[name="id"]');
      var id = idInput ? idInput.value : location.pathname;
      var name = (document.querySelector('h1') || {}).textContent || 'Product';
      name = name.trim();
      var priceEl = document.querySelector('.price-item--sale.main-price') ||
        document.querySelector('.main-price') ||
        document.querySelector('.main-price .price-item');
      var price = Math.round(parsePrice(priceEl && priceEl.textContent));
      var imgEl = document.querySelector('.product__media-list img') ||
        document.querySelector('.product__media img');
      var img = imgEl ? imgEl.getAttribute('src') : '';
      img = (img || '').replace(/^(\.\.\/)+/, '');
      var shadeEl = form.querySelector('.variant-dropdown') || document.querySelector('.variant-dropdown');
      var variant = shadeEl ? shadeEl.value : '';
      var items = load();
      var found = items.filter(function (i) { return i.id === id; })[0];
      if (found) found.qty += 1;
      else items.push({ id: id, name: name, price: price, qty: 1, img: img, variant: variant });
      save(items);
      var btn = form.querySelector('.product-form__submit');
      runAddFx(btn, imgEl, id);
    } else if (kind === 'cart') {
      e.preventDefault();
    } else if (kind === 'contact') {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data._subject = 'New message — CateyePen website';
      var btn2 = form.querySelector('button[type="submit"]');
      if (btn2) btn2.disabled = true;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        form.outerHTML = res.ok
          ? '<p class="newsletter-form__success" style="padding:12px 0;">Thanks! Your message has been sent.</p>'
          : '<p style="padding:12px 0;">Something went wrong — please try again.</p>';
      }).catch(function () {
        if (btn2) btn2.disabled = false;
        form.outerHTML = '<p style="padding:12px 0;">Something went wrong — please try again.</p>';
      });
    }
  });

  /* ---- cart page (premium layout) ---- */
  var LAMP_ID = 'cp-lamp';
  function lineHTML(item, idx) {
    var id = esc(item.id);
    if (item.price === 0) {
      return '<div class="cp-line cp-line--gift" data-id="' + id + '" style="--i:' + idx + '">' +
        '<span class="gi">' + giftIcon(item.name) + '</span>' +
        '<div><p class="cp-line__name">' + esc(cleanGiftName(item.name)) + '</p><small>Included free with your bundle</small></div>' +
        '<span class="cp-free">FREE</span></div>';
    }
    return '<div class="cp-line" data-id="' + id + '" style="--i:' + idx + '">' +
      (item.img ? '<img src="' + esc(item.img.replace(/^images\//, imgBase())) + '" alt="' + esc(item.name) + '">' : '<span></span>') +
      '<div>' +
        '<p class="cp-line__name">' + esc(item.name) + '</p>' +
        (item.variant ? '<div class="cp-line__var">Colour: ' + esc(item.variant) + '</div>' : '<div class="cp-line__var"></div>') +
        '<div class="cp-qty"><button type="button" data-dec="' + id + '" aria-label="Decrease quantity">\u2212</button>' +
          '<output>' + item.qty + '</output>' +
          '<button type="button" data-inc="' + id + '" aria-label="Increase quantity">+</button></div>' +
        '<button type="button" class="cp-rm" data-remove="' + id + '">Remove</button>' +
      '</div>' +
      '<div class="cp-line__price">' + money(item.price * item.qty) +
        (item.qty > 1 ? '<div class="cp-line__unit">' + money(item.price) + ' each</div>' : '') + '</div>' +
    '</div>';
  }
  var lastTotal = null;
  function renderCartPage() {
    var list = document.getElementById('cpCartList');
    if (!list) return;
    var items = load();
    var paid = items.filter(function (i) { return i.price !== 0; });
    var gifts = items.filter(function (i) { return i.price === 0; });
    var empty = items.length === 0;
    list.innerHTML = paid.concat(gifts).map(lineHTML).join('');
    list.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () {
        if (im.dataset.retried) return;
        im.dataset.retried = '1';
        im.src = im.src.replace(/\.(png|jpe?g)$/i, function (m) { return m.toLowerCase().endsWith('png') ? '.jpg' : '.png'; });
      });
    });
    document.getElementById('cpCart').style.display = empty ? 'none' : '';
    document.getElementById('cpEmpty').hidden = !empty;
    var total = items.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
    ['cpSub', 'cpTot'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = money(total);
      if (lastTotal !== null && lastTotal !== total) { el.classList.remove('cp-tick'); void el.offsetWidth; el.classList.add('cp-tick'); }
    });
    lastTotal = total;
    /* upsell: the mini UV lamp, unless it is already in the cart (bought or free gift) */
    var up = document.getElementById('cpUpsell');
    if (up) {
      var hasLamp = items.some(function (i) { return i.id === LAMP_ID || /lamp/i.test(i.name); });
      up.innerHTML = (!empty && !hasLamp)
        ? '<div class="cp-upsell"><img src="' + imgBase() + 'Snimekobrazovky2026-09-21v17.25.00.6e9e9.png" alt="">' +
          '<div><b>Add the Mini UV Lamp</b><small>Cure gel polish at home &middot; ' + money(LAMP_PRICE) + '</small></div>' +
          '<button type="button" class="cp-btn" data-addlamp="1"><span>Add</span></button></div>'
        : '';
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : e.target.parentElement;
    if (!t) return;
    var addLamp = t.closest('[data-addlamp]');
    if (addLamp) {
      e.preventDefault();
      var its = load();
      if (!its.some(function (i) { return i.id === LAMP_ID; })) {
        its.push({ id: LAMP_ID, name: 'CateyePen\u2122 Mini UV Light Cure Nails Lamp for Gel Nails', price: LAMP_PRICE, qty: 1, img: 'images/Snimekobrazovky2026-09-21v17.25.00.6e9e9.png' });
        save(its); renderCartPage(); updateBubble(); bumpCart(); toast('Added to your cart');
      }
      return;
    }
    var inc = t.closest('[data-inc]');
    var dec = t.closest('[data-dec]');
    var rem = t.closest('[data-remove]');
    if (!(inc || dec || rem)) return;
    e.preventDefault();
    var node = inc || dec || rem;
    var id = node.getAttribute('data-inc') || node.getAttribute('data-dec') || node.getAttribute('data-remove');
    var cur = load().filter(function (i) { return i.id === id; })[0];
    if (!cur) return;
    var leaving = !!rem || (!!dec && cur.qty <= 1);
    function apply() {
      var items = load();
      var item = items.filter(function (i) { return i.id === id; })[0];
      if (!item) return;
      if (inc) item.qty += 1;
      if (dec) item.qty -= 1;
      if (rem) item.qty = 0;
      if (item.qty <= 0) {
        var m = item.id.match(/^cp-pen-(\d)$/);
        if (m) items = items.filter(function (i) { return i.id.indexOf('cp-gift-' + m[1] + '-') !== 0; });
      }
      items = items.filter(function (i) { return i.qty > 0; });
      save(items);
      renderCartPage();
      updateBubble();
      if (drawerEl && drawerEl.classList.contains('is-open')) renderDrawer();
      var out = document.querySelector('.cp-line[data-id="' + id + '"] output');
      if (out) { out.classList.add('bump'); }
    }
    if (leaving) {
      var row = node.closest('.cp-line');
      if (row && !reduceMotion) { row.classList.add('is-leaving'); setTimeout(apply, 360); } else apply();
      toast('Removed from your cart');
    } else apply();
  });

  /* ---- stubs for theme custom elements / inline handlers ---- */
  if (window.customElements && !customElements.get('cart-drawer')) {
    customElements.define('cart-drawer', class extends HTMLElement {
      open() {}
      close() { this.removeAttribute('open'); }
    });
  }
  if (window.customElements && !customElements.get('slideshow-component')) {
    customElements.define('slideshow-component', class extends HTMLElement {});
  }
  window.handleScrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---- slideshow auto-rotation + controls ---- */
  (function () {
    var boxes = document.querySelectorAll('.slideshow');
    boxes.forEach(function (box) {
      var slides = box.querySelectorAll('.slideshow__slide');
      if (slides.length < 2) return;
      var style = document.createElement('style');
      style.textContent =
        '.slideshow.js{display:flex!important;overflow:hidden;' +
        'transition:transform .7s cubic-bezier(.25,.6,.25,1)}' +
        '.slideshow.js .slideshow__slide{display:flex!important;flex:0 0 100%;min-width:100%}';
      document.head.appendChild(style);
      box.classList.add('js');
      var idx = 0;
      var timer = null;
      function show(n) {
        idx = (n + slides.length) % slides.length;
        box.style.transform = 'translateX(-' + (idx * 100) + '%)';
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
        (box.parentElement || document).querySelectorAll('.slider-counter__link--dots')
          .forEach(function (d, i) {
            d.setAttribute('aria-current', i === idx ? 'true' : 'false');
          });
      }
      function restart() {
        if (timer) clearInterval(timer);
        timer = setInterval(function () { show(idx + 1); }, 5000);
      }
      show(0);
      restart();
      var wrap = box.parentElement || document;
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('.slider-button--next, .slider-button--prev, .slider-counter__link--dots');
        if (!b) return;
        if (b.classList.contains('slider-button--next')) show(idx + 1);
        else if (b.classList.contains('slider-button--prev')) show(idx - 1);
        else show(Array.prototype.indexOf.call(
          b.parentElement.children, b));
        restart();
      });
    });
  })();

  /* ---- product reviews carousel pagination ---- */
  (function () {
    var wrap = document.querySelector('.clrv');
    if (!wrap) return;
    var view = wrap.querySelector('.clrv-view');
    var track = wrap.querySelector('.clrv-track');
    var dots = wrap.querySelector('.clrv-dots');
    var prev = wrap.querySelector('[data-clrv="prev"]');
    var next = wrap.querySelector('[data-clrv="next"]');
    if (!view || !track) return;
    var cards = track.querySelectorAll('.clrv-card');
    if (cards.length < 2) return;
    var idx = 0, perPage = 1, pages = 1;
    function gapOf() {
      return parseFloat(getComputedStyle(track).columnGap) || 16;
    }
    function stepOf() {
      return cards[0].getBoundingClientRect().width + gapOf();
    }
    function apply() {
      var off = Math.min(idx * perPage * stepOf(),
        Math.max(0, track.scrollWidth - view.clientWidth));
      track.style.transform = 'translateX(-' + off + 'px)';
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= pages - 1;
      if (dots) Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle('is-on', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }
    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.className = 'clrv-dot';
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Reviews page ' + (i + 1));
        b.dataset.page = i;
        dots.appendChild(b);
      }
    }
    function measure() {
      var perPageNew = Math.max(1, Math.round(view.clientWidth / stepOf()));
      if (perPageNew !== perPage || pages === 1) {
        perPage = perPageNew;
        pages = Math.max(1, Math.ceil(cards.length / perPage));
        if (idx > pages - 1) idx = pages - 1;
        buildDots();
      }
      apply();
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-clrv]') : null;
      if (!b || !wrap.contains(b)) return;
      e.preventDefault();
      if (b.getAttribute('data-clrv') === 'next') idx = Math.min(pages - 1, idx + 1);
      else idx = Math.max(0, idx - 1);
      apply();
    });
    if (dots) dots.addEventListener('click', function (e) {
      var b = e.target.closest('.clrv-dot');
      if (!b) return;
      idx = parseInt(b.dataset.page, 10) || 0;
      apply();
    });
    var rt;
    function remeasure() { clearTimeout(rt); rt = setTimeout(measure, 120); }
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(view);
    measure();
    remeasure();
  })();

  /* ---- bundle offers (Buy 1 / 2 / 3 with free gifts) ---- */
  (function () {
    var form = document.querySelector('.product-form');
    if (!form || document.querySelector('.cp-bundle')) return;
    var UNIT = PEN_PRICE;
    var og = document.querySelector('meta[property="og:title"]');
    var titleEl = document.querySelector('.product__title');
    var name = (og && og.content) ? og.content.trim()
      : (titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : 'CateyePen Cat Eye Nail Gel Pen');
    var imgEl = document.querySelector('.product__media-list img, .product__media img');
    var img = imgEl ? imgEl.getAttribute('src').replace(/^(\.\.\/)+/, '') : '';
    var OPTS = [
      { n: 1, off: 0,    label: 'Buy 1 Nail Pen',  gifts: [] },
      { n: 2, off: 0.10, label: 'Buy 2 Nail Pens', gifts: ['warranty', 'uv'] },
      { n: 3, off: 0.15, label: 'Buy 3 Nail Pens', gifts: ['warranty', 'uv', 'ship'] }
    ];
    var GIFTS = {
      warranty: { name: '2 - Year Warranty', val: 499 },
      uv:       { name: 'Mini UV Light Cure Nails Lamp', val: LAMP_PRICE },
      ship:     { name: 'Shipping protection', val: 99 }
    };
    var SHADES = ['Floating Glow', 'Frosted Sugar', 'French Tuffle', 'Eaves Rain',
      'Ebony Rose', 'Floral Wine', 'Shimmer Taro'];
    var ICONS = { warranty: '🛡️', uv: '🔦', ship: '📦' };
    var box = document.createElement('div');
    box.className = 'cp-bundle';
    var thumbSrc = imgBase() + img.replace(/^images\//, '');
    function shadeSelect() {
      return '<select class="cp-bundle__select">' + SHADES.map(function (s) {
        return '<option>' + s + '</option>';
      }).join('') + '</select>';
    }
    var giftsHTML =
      '<div class="cp-gifts-head"><b>🎁 Free gifts with your order</b>' +
      '<span>Unlock selecting a higher bundle</span></div>' +
      '<div class="cp-gifts">' + Object.keys(GIFTS).map(function (k) {
        return '<div class="cp-gift is-locked" data-gift="' + k + '">' +
          '<span class="cp-gift__free">FREE <s>' + money(GIFTS[k].val) + '</s></span>' +
          '<span class="cp-gift__icon">' + ICONS[k] + '</span>' +
          '<span class="cp-gift__name">' + GIFTS[k].name + '</span>' +
          (k === 'uv' ? '<select class="cp-gift__select"><option>pink</option><option>white</option></select>' : '') +
        '</div>';
      }).join('') + '</div>';
    box.innerHTML = OPTS.map(function (o, i) {
      var unit = Math.round(UNIT * (1 - o.off));
      var total = unit * o.n;
      var save = UNIT * o.n - total;
      var rows = '';
      for (var p = 0; p < o.n; p++) {
        rows += '<span class="cp-bundle__colorrow">' +
          '<img src="' + thumbSrc + '" alt="">' + shadeSelect() + '</span>';
      }
      return '<label class="cp-bundle__opt' + (i === 0 ? ' is-on' : '') + '">' +
        '<input type="radio" name="cp-bundle" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="cp-bundle__top">' +
          '<span class="cp-bundle__radio"></span>' +
          '<b>' + o.label + '</b>' +
          (o.off ? '<span class="cp-bundle__save">Save ' + Math.round(o.off * 100) + '%</span>' : '') +
          '<span class="cp-bundle__prices"><b>' + money(total) + '</b>' +
            (save > 0 ? '<s>' + money(UNIT * o.n) + '</s>' : '') + '</span>' +
        '</span>' +
        '<span class="cp-bundle__colors"><span class="cp-bundle__colorslabel">colors</span>' + rows + '</span>' +
      '</label>';
    }).join('') + giftsHTML;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cp-bundle__add button button--primary';
    btn.textContent = 'Add to cart';
    box.appendChild(btn);
    var st = document.createElement('style');
    st.textContent =
      '.cp-bundle{display:flex;flex-direction:column;gap:12px;margin:16px 0}' +
      '.cp-bundle__opt{display:flex;flex-direction:column;gap:10px;border:1px solid #e8d3df;' +
      'border-radius:14px;padding:14px;cursor:pointer;background:#fff}' +
      '.cp-bundle__opt.is-on{border-color:#b07a96;box-shadow:0 0 0 1px #b07a96}' +
      '.cp-bundle__opt input{position:absolute;opacity:0}' +
      '.cp-bundle__top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}' +
      '.cp-bundle__top b{font-size:16px}' +
      '.cp-bundle__radio{flex:0 0 18px;width:18px;height:18px;border-radius:50%;' +
      'border:2px solid #b07a96;box-sizing:border-box}' +
      '.cp-bundle__opt.is-on .cp-bundle__radio{background:radial-gradient(circle,#b07a96 0 45%,transparent 50%)}' +
      '.cp-bundle__save{background:#f6e7ef;color:#80496a;font-size:12px;font-weight:700;' +
      'border-radius:999px;padding:4px 10px}' +
      '.cp-bundle__prices{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}' +
      '.cp-bundle__prices b{font-size:16px}' +
      '.cp-bundle__prices s{opacity:.55;font-size:12.5px}' +
      '.cp-bundle__colors{display:flex;flex-direction:column;gap:6px}' +
      '.cp-bundle__colorslabel{font-size:12.5px;color:#6f5066}' +
      '.cp-bundle__colorrow{display:flex;align-items:center;gap:10px}' +
      '.cp-bundle__colorrow img{width:44px;height:44px;object-fit:cover;border-radius:8px;flex:0 0 44px}' +
      '.cp-bundle__select,.cp-gift__select{border:1px solid #dcc0d0;border-radius:8px;padding:8px 10px;' +
      'font-size:13.5px;background:#fff;color:#333;max-width:220px}' +
      '.cp-gifts-head{display:flex;flex-direction:column;gap:2px;margin-top:6px;align-items:center;text-align:center}' +
      '.cp-gifts-head b{font-size:18px}' +
      '.cp-gifts-head span{color:#6f5066;font-size:13px}' +
      '.cp-gifts{display:flex;gap:12px}' +
      '.cp-gift{flex:1;border:1px solid #e8d3df;border-radius:14px;padding:14px 10px;' +
      'display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;background:#fff;' +
      'transition:opacity .25s,filter .25s}' +
      '.cp-gift.is-locked{opacity:.45;filter:grayscale(.6)}' +
      '.cp-gift__free{font-size:11.5px;font-weight:700;color:#b0386a;background:#fbeef4;' +
      'border-radius:999px;padding:4px 10px}' +
      '.cp-gift__free s{opacity:.6}' +
      '.cp-gift__icon{font-size:44px;line-height:1}' +
      '.cp-gift__name{font-size:13px;line-height:1.4;font-weight:600}';
    document.head.appendChild(st);
    form.parentNode.insertBefore(box, form);
    function syncGifts() {
      var sel = box.querySelector('input[name="cp-bundle"]:checked');
      var o = OPTS[sel ? +sel.value : 0];
      box.querySelectorAll('.cp-gift').forEach(function (g) {
        g.classList.toggle('is-locked', o.gifts.indexOf(g.getAttribute('data-gift')) === -1);
      });
    }
    syncGifts();
    box.addEventListener('change', function (e) {
      if (e.target.name !== 'cp-bundle') return;
      box.querySelectorAll('.cp-bundle__opt').forEach(function (o, i) {
        o.classList.toggle('is-on', i === +e.target.value);
      });
      syncGifts();
    });
    btn.addEventListener('click', function () {
      var sel = box.querySelector('input[name="cp-bundle"]:checked');
      var o = OPTS[sel ? +sel.value : 0];
      var items = load();
      var unit = Math.round(UNIT * (1 - o.off));
      var optEl = box.querySelectorAll('.cp-bundle__opt')[sel ? +sel.value : 0];
      var variant = [].map.call(optEl.querySelectorAll('.cp-bundle__select'), function (s) {
        return s.value;
      }).join(', ');
      var pen = items.find(function (i) { return i.id === 'cp-pen-' + o.n; });
      if (pen) { pen.qty += o.n; pen.variant = variant; }
      else items.push({ id: 'cp-pen-' + o.n, name: name + ' (' + o.label + ')', price: unit, qty: o.n, img: img, variant: variant });
      o.gifts.forEach(function (g, gi) {
        var gid = 'cp-gift-' + o.n + '-' + gi;
        if (!items.some(function (i) { return i.id === gid; })) {
          items.push({ id: gid, name: GIFTS[g].name + ' (FREE)', price: 0, qty: 1, img: '' });
        }
      });
      save(items);
      runAddFx(btn, document.querySelector('.product__media-list img'), 'cp-pen-' + o.n);
    });
  })();

  /* ---- product gallery: clickable thumbnails + working arrows ---- */
  (function () {
    var main = document.querySelector('.product__media-list');
    if (!main) return;
    var thumbs = document.querySelectorAll('.thumbnail-list .thumbnail, .product__thumbnail-list .thumbnail');
    var thumbList = document.querySelector('.thumbnail-list, .product__thumbnail-list');
    var st = document.createElement('style');
    st.textContent =
      '.product__media-list{display:flex!important;overflow-x:auto;scroll-behavior:smooth;' +
      'scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none}' +
      '.product__media-list::-webkit-scrollbar{display:none}' +
      '.product__media-list>li{flex:0 0 100%;min-width:100%;scroll-snap-align:center}' +
      '.product-media-container{aspect-ratio:1/1;border-radius:14px;overflow:hidden}' +
      '.product-media-container img{width:100%!important;height:100%!important;object-fit:contain}' +
      '.thumbnail-list{display:flex;gap:10px;overflow-x:auto;scroll-behavior:smooth;' +
      'scrollbar-width:none;-ms-overflow-style:none;padding:2px}' +
      '.thumbnail-list::-webkit-scrollbar{display:none}' +
      '.thumbnail-list>li{flex:0 0 calc((100% - 40px)/5);min-width:0}' +
      '.thumbnail{display:block;width:100%;padding:0;border:2px solid transparent;' +
      'border-radius:12px;overflow:hidden;background:#fff;cursor:pointer}' +
      '.thumbnail img{width:100%!important;height:100%!important;aspect-ratio:1/1;' +
      'object-fit:cover;border-radius:10px;display:block}' +
      '.thumbnail[aria-current="true"]{border-color:#b07a96}' +
      '@media (max-width:749px){.thumbnail-list>li{flex:0 0 calc((100% - 20px)/3)}}';
    document.head.appendChild(st);
    var slides = main.children;
    function isNext(b) { return /next/.test(b.className) || b.getAttribute('name') === 'next'; }
    var galWrap = main.parentElement; if (getComputedStyle(galWrap).position === 'static') galWrap.style.position = 'relative';
    var cnt = document.createElement('span'); cnt.className = 'cp-galcount'; galWrap.appendChild(cnt);
    var dotsEl = document.createElement('div'); dotsEl.className = 'cp-galdots';
    for (var di = 0; di < slides.length; di++) dotsEl.appendChild(document.createElement('i'));
    main.insertAdjacentElement('afterend', dotsEl);
    function setActive(i) {
      thumbs.forEach(function (t, ti) {
        t.setAttribute('aria-current', ti === i ? 'true' : 'false');
      });
      cnt.textContent = (i + 1) + ' / ' + slides.length;
      [].forEach.call(dotsEl.children, function (d, k) { d.classList.toggle('on', k === i); });
    }
    function current() {
      var best = 0, bd = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs((slides[i].offsetLeft - main.offsetLeft) - main.scrollLeft);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      main.scrollTo({ left: slides[i].offsetLeft - main.offsetLeft, behavior: 'smooth' });
      setActive(i);
      if (thumbs[i] && thumbList) {
        thumbList.scrollTo({ left: Math.max(0, thumbs[i].parentElement.offsetLeft - 80), behavior: 'smooth' });
      }
    }
    function thumbStep() {
      if (!thumbList) return 220;
      var li = thumbList.querySelector('li');
      if (!li) return 220;
      var cs = getComputedStyle(thumbList);
      var gap = parseFloat(cs.columnGap || cs.gap) || 10;
      return li.getBoundingClientRect().width + gap;
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function (e) { e.preventDefault(); killAuto(); goTo(i); });
    });
    document.querySelectorAll('.slider-button--prev, .slider-button--next, .splide__arrow--prev, .splide__arrow--next')
      .forEach(function (b) {
        b.addEventListener('click', function (e) {
          if (b.closest('.thumbnail-slider')) {
            if (!thumbList) return;
            e.preventDefault();
            thumbList.scrollBy({ left: isNext(b) ? thumbStep() : -thumbStep(), behavior: 'smooth' });
            return;
          }
          if (!b.closest('media-gallery, [id*=GalleryViewer], .product__media-wrapper')) return;
          e.preventDefault();
          killAuto();
          goTo(current() + (isNext(b) ? 1 : -1));
        });
      });
    var sc;
    main.addEventListener('scroll', function () {
      setActive(current());
    });
    var auto = null, stopped = false;
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
    function killAuto() { stopped = true; stopAuto(); }
    function startAuto() {
      if (stopped || slides.length < 2) return;
      stopAuto();
      auto = setInterval(function () {
        var i = current();
        goTo(i + 1 >= slides.length ? 0 : i + 1);
      }, 4500);
    }
    var gallery = main.closest('media-gallery') || main.parentElement;
    gallery.addEventListener('pointerenter', stopAuto);
    gallery.addEventListener('pointerleave', startAuto);
    main.addEventListener('wheel', killAuto, { passive: true });
    main.addEventListener('touchstart', killAuto, { passive: true });
    setActive(0);
    if (window.matchMedia && matchMedia('(max-width: 749px)').matches) stopped = true;
    startAuto();
  })();

  /* ---- hydrate product gallery + thumbnails with local images ---- */
  (function () {
    var GALLERY = [
      'cateyepen-cateye-hero.55314.jpg',
      'Snimekobrazovky2026-09-21v17.25.00.1c0aa.png',
      'hf_20260921_140626_a6836830-8f7f-4180-9cd6-0ece89c95381.98798.jpg',
      'hf_20260921_143235_11632a98-ac4b-42e8-bcc5-989a60d4844b.052d1.jpg',
      'hf_20260916_174849_b643a16c-6261-48b9-8efd-f1a2f8db3a33.897b5.png',
      'hf_20260916_174849_1962569b-0680-4914-b697-ba53f97fc94b.2d640.jpg'
    ];
    var base = imgBase();
    var slides = document.querySelectorAll('.product__media-list > li');
    slides.forEach(function (li, i) {
      var box = li.querySelector('.product-media-container');
      if (!box || box.querySelector('img')) return;
      li.querySelectorAll('div.product__media').forEach(function (d) {
        if (!d.querySelector('img') && !d.children.length) d.remove();
      });
      var host = li.querySelector('modal-opener') || box;
      var img = document.createElement('img');
      img.src = base + GALLERY[i % GALLERY.length];
      img.alt = li.getAttribute('data-alt') || 'CateyePen cat eye nail gel pen';
      img.className = 'product__media media';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block';
      host.appendChild(img);
    });
    var thumbs = document.querySelectorAll('.thumbnail-list > li, .product__thumbnail-list > li');
    thumbs.forEach(function (li, i) {
      var btn = li.querySelector('button') || li;
      if (btn.querySelector('img')) return;
      var img = document.createElement('img');
      img.src = base + GALLERY[i % GALLERY.length];
      img.alt = 'CateyePen cat eye nail gel pen view ' + (i + 1);
      img.className = 'thumbnail__image';
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
      btn.appendChild(img);
    });
  })();

  /* ---- scroll-reveal: drive the theme's native animate--hidden -> animate--shown ---- */
  (function () {
    var sections = document.querySelectorAll('.animate-section');
    if (!sections.length) return;
    function reveal(el) {
      el.classList.remove('animate--hidden');
      el.classList.add('animate--shown');
    }
    if (!('IntersectionObserver' in window)) {
      sections.forEach(reveal);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          reveal(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---- gentle reveal for homepage cards ---- */
  (function () {
    var els = document.querySelectorAll('.cp-why__card, .cp-pcard, .cp-trust__row span, .cp-h2');
    if (!els.length || !('IntersectionObserver' in window) || reduceMotion) return;
    var st = document.createElement('style');
    st.textContent = '.cp-rv{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);transition-delay:var(--d,0ms)}.cp-rv.cp-in{opacity:1;transform:none}';
    document.head.appendChild(st);
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('cp-in'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el, i) { el.style.setProperty('--d', (i % 3) * 90 + 'ms'); el.classList.add('cp-rv'); io.observe(el); });
  })();

  updateBubble();
  renderCartPage();
})();
