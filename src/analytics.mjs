export const consentKey = 'itop.analytics-consent.v1';
const consentAge = 180 * 24 * 60 * 60 * 1000;

export function readAnalyticsChoice(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(consentKey));
    return ['accepted','rejected'].includes(value?.choice) && Number.isFinite(value.savedAt) && value.savedAt <= now && now - value.savedAt < consentAge ? value.choice : null;
  } catch { return null; }
}

export function saveAnalyticsChoice(storage, choice, now = Date.now()) {
  if (!['accepted','rejected'].includes(choice)) return false;
  try { storage.setItem(consentKey, JSON.stringify({choice,savedAt:now})); return true; } catch { return false; }
}

export function analyticsPage(canonical, title, referrer = '') {
  let safeReferrer = '';
  try { safeReferrer = new URL(referrer).origin + '/'; } catch { /* No referrer. */ }
  const page = new URL(canonical);
  return {page_location:page.origin + page.pathname,page_title:title,page_referrer:safeReferrer};
}

// Loading is gated before any connection to Google; no denied-consent pings.
export function createAnalytics(win, doc, measurementId) {
  let started = false;
  const validId = /^G-[A-Z0-9]+$/.test(measurementId);
  return {
    start(choice, page) {
      if (choice !== 'accepted' || !validId || started) return false;
      started = true;
      win['ga-disable-' + measurementId] = false;
      win.dataLayer = win.dataLayer || [];
      win.gtag = function () { win.dataLayer.push(arguments); };
      win.gtag('consent', 'default', {analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      win.gtag('js', new Date());
      win.gtag('config', measurementId, {...page,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
      win.gtag('event', 'page_view', page);
      const script = doc.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      doc.head.append(script);
      return true;
    },
    stop() {
      if (!validId) return;
      win['ga-disable-' + measurementId] = true;
      for (const entry of doc.cookie.split(';')) {
        const name = entry.trim().split('=')[0];
        if (name !== '_ga' && !name.startsWith('_ga_')) continue;
        for (const domain of ['', '; domain=' + win.location.hostname, '; domain=.' + win.location.hostname]) doc.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax';
      }
      // Reload after withdrawal so a previously loaded Google library is gone.
      if (started) win.location.reload();
    }
  };
}
