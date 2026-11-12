import { useEffect } from 'react';

// Sections ease in as they scroll into view. Content is only hidden by this script,
// so it stays visible if scripts or IntersectionObserver are unavailable, and the
// whole effect is skipped when the visitor asks for reduced motion.
const targets = '.home-section, .repair-finder, .repair-services, .repair-directory, .home-brand-card, .repair-service, .service-path, .product-card, .phone-model, .phone-brand';

export function useScrollReveal(routeKey: string) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    function scan() {
      const viewport = window.innerHeight;
      document.querySelectorAll(targets).forEach(element => {
        if (seen.has(element)) return;
        seen.add(element);
        // Anything already on screen stays as it is, so nothing flashes on load.
        if (element.getBoundingClientRect().top < viewport) return;
        element.classList.add('reveal');
        observer.observe(element);
      });
    }
    scan();
    // Pages render more content after choices are made (for example price results).
    const mutations = new MutationObserver(() => scan());
    const main = document.getElementById('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.querySelectorAll('.reveal').forEach(element => element.classList.remove('reveal', 'reveal-in'));
    };
  }, [routeKey]);
}
