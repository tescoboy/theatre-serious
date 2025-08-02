export function matchRoute(pathname: string) {
  const m = pathname.match(/^\/reviews\/(\d{4})\/([a-z0-9-]+)\/?$/);
  if (m) return { name: "review", params: { year: m[1], slug: m[2] } };
  return { name: "home", params: {} };
}

export function linkForReview(d: { date: string|Date; slug: string }) {
  const year = (d.date instanceof Date ? d.date : new Date(d.date)).getUTCFullYear();
  return `/reviews/${year}/${d.slug}`;
}

export function navigateTo(path: string) {
  if (location.pathname !== path) history.pushState({}, "", path);
  renderFromLocation();
}

export function installRouter(handlers: { onHome: () => void; onReview: (p:{year:string;slug:string}) => void; }) {
  function render() {
    const m = matchRoute(location.pathname);
    if (m.name === "review") handlers.onReview(m.params);
    else handlers.onHome();
  }
  (window as any).renderFromLocation = render;
  window.addEventListener("popstate", render);
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[data-nav="spa"]') as HTMLAnchorElement | null;
    if (a && a.origin === location.origin) {
      e.preventDefault();
      navigateTo(a.pathname + a.search);
    }
  });
  render();
}

export function shareToWhatsApp(url: string, text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank");
} 