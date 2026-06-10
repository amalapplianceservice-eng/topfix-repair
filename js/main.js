/* TopFix Repair — interactivity */
(function () {
  'use strict';

  // Preloader — hide once the page has loaded
  var preloader = document.getElementById('preloader');
  if (preloader) {
    document.documentElement.classList.add('no-scroll');
    var hidePreloader = function () {
      preloader.classList.add('is-hidden');
      document.documentElement.classList.remove('no-scroll');
      setTimeout(function () { if (preloader.parentNode) preloader.remove(); }, 600);
    };
    window.addEventListener('load', function () {
      setTimeout(hidePreloader, 400); // brief spin moment
    });
    // Fallback in case the load event already fired or stalls
    setTimeout(hidePreloader, 4000);
  }

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      });
    });
  }

  // FAQ accordion — keep only one open at a time
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Service-area map (Leaflet + dark CARTO tiles, brand-colored zone)
  var mapEl = document.getElementById('serviceMap');
  if (mapEl && window.L) {
    var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true });
    map.attributionControl.setPrefix(false);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap, &copy; CARTO'
    }).addTo(map);

    // Service area — approximate City of Los Angeles outline
    var serviceArea = [
      [34.3, -118.67], [34.34, -118.5], [34.34, -118.41], [34.28, -118.29], [34.22, -118.27],
      [34.16, -118.2], [34.07, -118.16], [34.01, -118.18], [33.96, -118.22], [33.93, -118.24],
      [33.88, -118.25], [33.82, -118.26], [33.76, -118.27], [33.71, -118.28], [33.7, -118.3],
      [33.71, -118.33], [33.74, -118.4], [33.8, -118.42], [33.86, -118.43], [33.91, -118.45],
      [33.95, -118.46], [33.98, -118.48], [34.01, -118.5], [34.03, -118.52], [34.05, -118.54],
      [34.13, -118.57], [34.2, -118.6], [34.26, -118.64]
    ];
    var poly = L.polygon(serviceArea, {
      color: '#5FBA7A', weight: 2.5, opacity: 1,
      fillColor: '#2E8B57', fillOpacity: 0.25
    }).addTo(map);

    L.circleMarker([34.08225, -118.37210], {
      radius: 9, color: '#5FBA7A', weight: 4, fillColor: '#ffffff', fillOpacity: 1
    }).addTo(map).bindPopup('TopFix Repair &mdash; West Hollywood, CA');

    map.fitBounds(poly.getBounds(), { padding: [24, 24] });
  }

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Booking modal — open from any link/button pointing to #book
  var bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    var openModal = function (e) {
      if (e) e.preventDefault();
      bookingModal.hidden = false;
      document.documentElement.classList.add('no-scroll');
      var firstField = bookingModal.querySelector('input, select');
      if (firstField) setTimeout(function () { firstField.focus(); }, 60);
    };
    var closeModal = function () {
      bookingModal.hidden = true;
      document.documentElement.classList.remove('no-scroll');
    };
    document.querySelectorAll('a[href="#book"]').forEach(function (a) {
      a.addEventListener('click', openModal);
    });
    var closeBtn = bookingModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    bookingModal.addEventListener('click', function (e) {
      if (e.target === bookingModal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !bookingModal.hidden) closeModal();
    });
  }

  // Booking forms (front-end only demo handling) — applies to inline + modal forms
  document.querySelectorAll('.book-form').forEach(function (form) {
    // Show "Please specify your issue" only when Appliance = Other
    var applianceSel = form.querySelector('select[name="appliance"]');
    var issueField = form.querySelector('.issue-field');
    if (applianceSel && issueField) {
      var issueInput = issueField.querySelector('input, textarea');
      var syncIssue = function () {
        var show = applianceSel.value === 'Other';
        issueField.hidden = !show;
        if (issueInput) issueInput.required = show;
      };
      applianceSel.addEventListener('change', syncIssue);
      syncIssue();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = '✓ Request received!';
      btn.disabled = true;
      form.reset();
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        var overlay = form.closest('.modal-overlay');
        if (overlay) {
          overlay.hidden = true;
          document.documentElement.classList.remove('no-scroll');
        }
      }, 3000);
    });
  });
})();
