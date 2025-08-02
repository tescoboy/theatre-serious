export function matchRoute(pathname) {
  console.log(`Matching route for: ${pathname}`);
  const m = pathname.match(/^\/reviews\/(\d{4})\/([a-z0-9-]+)\/?$/);
  if (m) {
    console.log(`Matched review route: year=${m[1]}, slug=${m[2]}`);
    return { name: "review", params: { year: m[1], slug: m[2] } };
  }
  console.log('Matched home route');
  return { name: "home", params: {} };
}

export function linkForReview(d) {
  const year = (d.date instanceof Date ? d.date : new Date(d.date)).getUTCFullYear();
  return `/reviews/${year}/${d.slug}`;
}

export function navigateTo(path) {
  console.log(`Navigating to: ${path}`);
  if (location.pathname !== path) history.pushState({}, "", path);
  renderFromLocation();
}

export function installRouter(handlers) {
  console.log('Installing router with handlers:', handlers);
  
  function render() {
    console.log('Router render called');
    const m = matchRoute(location.pathname);
    if (m.name === "review") {
      console.log('Calling onReview handler');
      handlers.onReview(m.params);
    } else {
      console.log('Calling onHome handler');
      handlers.onHome();
    }
  }
  window.renderFromLocation = render;
  window.addEventListener("popstate", render);
  document.addEventListener("click", (e) => {
    const a = e.target?.closest?.('a[data-nav="spa"]');
    if (a && a.origin === location.origin) {
      e.preventDefault();
      navigateTo(a.pathname + a.search);
    }
  });
  render();
}

export function shareToWhatsApp(url, text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank");
} 