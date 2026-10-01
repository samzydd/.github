import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'dashboard' }
  | { name: 'search'; query: string }
  | { name: 'project'; projectId: string }
  | { name: 'template'; templateId: string }
  | { name: 'screens' };

export interface Location {
  route: Route;
  params: URLSearchParams;
}

function parse(hash: string): Location {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  const params = new URLSearchParams(search);
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);

  let route: Route = { name: 'dashboard' };
  if (parts[0] === 'search') route = { name: 'search', query: params.get('q') ?? '' };
  else if (parts[0] === 'projects' && parts[1]) route = { name: 'project', projectId: parts[1] };
  else if (parts[0] === 'templates' && parts[1]) route = { name: 'template', templateId: parts[1] };
  else if (parts[0] === 'screens') route = { name: 'screens' };
  return { route, params };
}

let current = parse(window.location.hash);
const listeners = new Set<() => void>();

window.addEventListener('hashchange', () => {
  current = parse(window.location.hash);
  listeners.forEach((l) => l());
});

export function useLocation(): Location {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}

export function href(route: Route, params?: Record<string, string>): string {
  let path = '/';
  const query = new URLSearchParams(params);
  switch (route.name) {
    case 'search':
      path = '/search';
      query.set('q', route.query);
      break;
    case 'project':
      path = `/projects/${encodeURIComponent(route.projectId)}`;
      break;
    case 'template':
      path = `/templates/${encodeURIComponent(route.templateId)}`;
      break;
    case 'screens':
      path = '/screens';
      break;
  }
  const qs = query.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

export function navigate(route: Route, params?: Record<string, string>) {
  window.location.hash = href(route, params);
  window.scrollTo(0, 0);
}
