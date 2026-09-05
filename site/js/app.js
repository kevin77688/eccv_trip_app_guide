(function () {
  "use strict";

  const core = window.ECCV_CORE;
  if (!core) return;

  const page = core.page;
  const pages = window.ECCV_PAGES || {};

  // Setup tickets modal listener
  if (window.ECCV_TICKETS?.setup) {
    window.ECCV_TICKETS.setup();
  }

  // Setup swipe navigation
  if (core.setupSwipeNavigation) {
    core.setupSwipeNavigation();
  }

  // Register service worker
  if (core.setupServiceWorker) {
    core.setupServiceWorker();
  }

  // Dispatch page rendering
  if (page === "home") {
    pages.home?.render?.();
  } else if (page === "places") {
    pages.places?.render?.();
  } else if (page === "logistics") {
    pages.logistics?.render?.();
  } else if (page === "packing") {
    pages.packing?.render?.();
  } else if (page === "tools") {
    pages.tools?.render?.();
  } else if (page === "day") {
    pages.day?.render?.(core.dayKey);
  }
  window.ECCV_JOURNEY?.setup();
})();
