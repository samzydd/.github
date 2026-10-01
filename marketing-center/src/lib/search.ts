import { PROJECTS, TEMPLATES, categoryById, productById, type Project, type Template } from '../data/catalog';

/** Lower-case and drop whitespace so "Sell 360" matches "Sell360". */
const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

const matches = (haystack: string[], query: string) => {
  const q = normalize(query);
  return q.length > 0 && haystack.some((h) => normalize(h).includes(q));
};

export function searchProjects(query: string): Project[] {
  return PROJECTS.filter((p) => matches([p.address, p.cityLine, `${p.address}, ${p.cityLine}`, productById(p.product).label, productById(p.product).badge], query));
}

export function searchTemplates(query: string): Template[] {
  return TEMPLATES.filter((t) => matches([t.fullName, t.name, categoryById(t.category).label], query));
}

export function searchAddresses(query: string): Project[] {
  return PROJECTS.filter((p) => matches([p.address, `${p.address}, ${p.cityLine}`], query));
}
