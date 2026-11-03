const base = import.meta.env.BASE_URL;

export function siteHref(path = ''): string {
  return base + path.replace(/^\//, '');
}

export function siteRoute(pathname: string): string {
  return pathname.startsWith(base) ? pathname.slice(base.length).replace(/\/$/, '') : '';
}
