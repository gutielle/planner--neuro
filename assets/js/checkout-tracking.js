(function () {
  "use strict";

  var CHECKOUT_BASE = "https://pay.hotmart.com/N107723281D?checkoutMode=10";
  var ALLOWED_KEYS = new Set([
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
    "gclid", "fbclid", "wbraid", "gbraid", "msclkid", "src", "sck"
  ]);

  function getAllowedParams(locationSearch) {
    var incoming = new URLSearchParams(locationSearch || window.location.search || "");
    var result = {};
    incoming.forEach(function (value, key) {
      var k = String(key).toLowerCase();
      if (ALLOWED_KEYS.has(k) || k.indexOf("utm_") === 0) {
        result[k] = value;
      }
    });
    return result;
  }

  function buildSck(params) {
    var parts = [];
    function addIf(key) { if (typeof params[key] === "string" && params[key].length) parts.push(params[key]); }
    addIf("sck");
    addIf("src");
    addIf("utm_source");
    addIf("utm_campaign");
    addIf("utm_medium");
    addIf("utm_content");
    addIf("utm_term");
    return parts.join("|");
  }

  function buildSrc(params, sck) {
    if (typeof params.src === "string" && params.src.length) return params.src;
    return sck || params.utm_source || params.sck || "";
  }

  function getCheckoutLinkWithTracking(checkoutUrl, locationSearch) {
    var base = checkoutUrl || CHECKOUT_BASE;
    var url;
    try { url = new URL(base); }
    catch (e) { return base; }

    var params = getAllowedParams(locationSearch);

    Object.keys(params).forEach(function (key) {
      if (!url.searchParams.has(key)) {
        try { url.searchParams.set(key, params[key]); } catch (_) {}
      }
    });

    if (!url.searchParams.has("sck")) {
      var sck = buildSck(params);
      if (sck.length) {
        try { url.searchParams.set("sck", sck); } catch (_) {}
      }
    }

    if (!url.searchParams.has("src")) {
      var src = buildSrc(params, url.searchParams.get("sck"));
      if (src.length) {
        try { url.searchParams.set("src", src); } catch (_) {}
      }
    }

    return url.toString();
  }

  function persistTracking() {
    try {
      var params = getAllowedParams();
      var sck = buildSck(params);
      var src = buildSrc(params, sck);
      if (sck.length) {
        try { localStorage.setItem("checkout_sck", sck); } catch (_) {}
        try { sessionStorage.setItem("checkout_sck", sck); } catch (_) {}
        try { localStorage.setItem("hotmart_sck", sck); } catch (_) {}
      }
      if (src.length) {
        try { localStorage.setItem("checkout_src", src); } catch (_) {}
        try { sessionStorage.setItem("checkout_src", src); } catch (_) {}
        try { localStorage.setItem("hotmart_src", src); } catch (_) {}
      }
      if (typeof window.hot === "function") {
        try {
          if (sck.length) window.hot("sck", sck);
          if (src.length) window.hot("src", src);
        } catch (_) {}
      }
    } catch (_) {}
  }

  function fireTrackingEvents() {
    try {
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", { value: 47, currency: "BRL" });
      }
    } catch (_) {}
    try {
      if (typeof window.hot === "function") {
        window.hot("event", "InitiateCheckout", { value: 47, currency: "BRL" });
      }
    } catch (_) {}
  }

  function isCheckoutLink(href) {
    if (!href) return false;
    var h = String(href).toLowerCase();
    return (
      h.indexOf("pay.hotmart.com") !== -1 ||
      h.indexOf("pay.kirvano.com") !== -1 ||
      h.indexOf("kirvano.com/checkout") !== -1 ||
      h.indexOf("checkout") !== -1 && h.indexOf("planner") !== -1
    );
  }

  function transformAllCtas() {
    var as = document.querySelectorAll("a.cta");
    var changedCount = 0;
    var matchedCount = 0;
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      var href = a.getAttribute("href") || "";
      if (!isCheckoutLink(href)) continue;
      matchedCount++;
      if (a.getAttribute("data-checkout-tracked") === "1") continue;
      a.setAttribute("data-checkout-tracked", "1");
      a.setAttribute("target", "_blank");
      var rel = (a.getAttribute("rel") || "").replace(/noopener|noreferrer/g, "").trim() + " noopener noreferrer";
      a.setAttribute("rel", rel.trim());
      var tracked = getCheckoutLinkWithTracking(href);
      a.setAttribute("href", tracked);
      a.addEventListener("click", function () { fireTrackingEvents(); });
      changedCount++;
    }
    return { changed: changedCount, totalMatched: matchedCount, totalCtas: as.length };
  }

  function boot() {
    persistTracking();
    var r = transformAllCtas();
    window.__plannerCheckoutStatus = {
      params: getAllowedParams(),
      finalSampleUrl: getCheckoutLinkWithTracking(CHECKOUT_BASE),
      ctasModified: r.changed,
      ctasMatchedCheckout: r.totalMatched,
      ctasTotalOnPage: r.totalCtas
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.PlannerCheckoutTracking = {
    getCheckoutLinkWithTracking: getCheckoutLinkWithTracking,
    getAllowedParams: getAllowedParams,
    fireTrackingEvents: fireTrackingEvents,
    transformAllCtas: transformAllCtas,
    BASE_URL: CHECKOUT_BASE
  };
})();
