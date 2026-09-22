(function () {
  "use strict";

  var HOTMART_BASE = "https://pay.hotmart.com/N107723281D";
  var ALLOWED_KEYS = new Set([
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
    "gclid", "fbclid", "wbraid", "gbraid", "msclkid", "src", "sck"
  ]);

  function getAllowedParams(locationSearch) {
    var incoming = new URLSearchParams(locationSearch || window.location.search || "");
    var result = {};
    incoming.forEach(function (value, key) {
      var k = key.toLowerCase();
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

  function getHotmartLinkWithTracking(hotmartUrl, locationSearch) {
    var base = hotmartUrl || HOTMART_BASE;
    var url;
    try { url = new URL(base); }
    catch (e) { return base; }

    var params = getAllowedParams(locationSearch);

    Object.keys(params).forEach(function (key) {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, params[key]);
      }
    });

    if (!url.searchParams.has("sck")) {
      var sck = buildSck(params);
      if (sck.length) url.searchParams.set("sck", sck);
    }

    if (!url.searchParams.has("src")) {
      var src = buildSrc(params, url.searchParams.get("sck"));
      if (src.length) url.searchParams.set("src", src);
    }

    return url.toString();
  }

  function persistTracking() {
    try {
      var params = getAllowedParams();
      var sck = buildSck(params);
      var src = buildSrc(params, sck);
      if (sck.length) { try { localStorage.setItem("hotmart_sck", sck); } catch (_) {} }
      if (src.length) { try { localStorage.setItem("hotmart_src", src); } catch (_) {} }
      if (typeof window.hot === "function") {
        try {
          if (sck.length) window.hot("sck", sck);
          if (src.length) window.hot("src", src);
        } catch (_) {}
      }
    } catch (_) {}
  }

  function attachCtaListeners() {
    var as = document.querySelectorAll('a.cta[href*="pay.hotmart.com"]');
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      if (a.getAttribute("data-hotmart-tracked") === "1") continue;
      a.setAttribute("data-hotmart-tracked", "1");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", (a.getAttribute("rel") || "") + " noopener noreferrer").trim();
      a.addEventListener("click", function (e) {
        var base = this.getAttribute("href") || HOTMART_BASE;
        var tracked = getHotmartLinkWithTracking(base);
        try {
          if (typeof window.fbq === "function") {
            window.fbq("track", "InitiateCheckout", { value: 47, currency: "BRL" });
          }
        } catch (_) {}
        try {
          if (typeof window.hot === "function") window.hot("event", "InitiateCheckout", { value: 47, currency: "BRL" });
        } catch (_) {}
        this.setAttribute("href", tracked);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { persistTracking(); attachCtaListeners(); });
  } else {
    persistTracking(); attachCtaListeners();
  }

  window.PlannerNeuroTracking = {
    getHotmartLinkWithTracking: getHotmartLinkWithTracking
  };
})();
