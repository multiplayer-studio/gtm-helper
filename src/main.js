(() => {
  const cookieKey = document.currentScript.dataset.cookieKey;
  const cookiesApproved = document.cookie
    .split("; ")
    .map((cookie) => cookie.includes(`${cookieKey}=all`))
    .includes(true);
  const GTMkey = document.currentScript.dataset.gtm;
  const GAkey = document.currentScript.dataset.ga;

  function enableGTM() {
    if (GTMkey) {
      window["dataLayer"] = window["dataLayer"] || [];
      window["dataLayer"].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
      const firstScript = document.getElementsByTagName("script")[0];
      const elem = document.createElement("script");
      const dl = "dataLayer" != "dataLayer" ? "&l=" + "dataLayer" : "";
      const noscriptElem = document.createElement("noscript");
      noscriptElem.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTMkey}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

      elem.async = true;
      elem.src = `https://www.googletagmanager.com/gtm.js?id=${GTMkey + dl}`;
      firstScript.parentNode.insertBefore(elem, firstScript);
      document.body.prepend(noscriptElem);
    }
  }

  function enableGA() {
    if (GAkey) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("event", "conversion_event_page_view_1", {});
      gtag("config", GAkey);
    }
  }

  function initiateCookies() {
    const exipiryDate = new Date();
    const monthInMilliseconds = 30 * 86400000;

    exipiryDate.setTime(exipiryDate.getTime() + monthInMilliseconds * 3);
    exipiryDate.toUTCString();
    document.cookie = `${cookieKey}=all; expires=${exipiryDate}`;
    document.querySelector('[gtm-helper-elem="banner"]')?.remove();

    enableGTM();
    enableGA();
  }

  function ignoreCookies() {
    document.querySelector('[gtm-helper-elem="banner"]')?.remove();
  }

  function initializeGTMHelper() {
    const cookieBanner = document.querySelector('[gtm-helper-elem="banner"]');

    if (!cookiesApproved && cookieKey && cookieBanner) {
      cookieBanner.classList.toggle("hide");
      document.querySelector('[gtm-helper-action="ignore"]')?.addEventListener("click", ignoreCookies);
      document.querySelector('[gtm-helper-action="accept"]')?.addEventListener("click", initiateCookies);
    } else {
      enableGTM();
      enableGA();
      if (cookieKey && cookieBanner) {
        cookieBanner.remove();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", initializeGTMHelper);
})();
