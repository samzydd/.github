import { art } from '../lib/assets';
import { href, type Route } from '../lib/router';

interface Screen {
  nodeId: string;
  name: string;
  route: Route;
  params?: Record<string, string>;
}

const dashboard: Route = { name: 'dashboard' };
const NO_PROMO = { promo: '0' };

/** Every frame in the Figma "mc v2" section, mapped to the URL that reproduces it. */
export const SCREENS: Screen[] = [
  { nodeId: '1:3865', name: 'Custom project empty state', route: dashboard, params: { ...NO_PROMO, projects: 'none' } },
  { nodeId: '1:4048', name: 'With custom project', route: dashboard, params: NO_PROMO },
  { nodeId: '1:4365', name: 'With custom project — full view', route: dashboard, params: { ...NO_PROMO, expanded: '1' } },
  { nodeId: '1:4407', name: 'Custom project marketing materials', route: { name: 'project', projectId: 'p1' } },
  { nodeId: '1:3782', name: 'Template preview', route: { name: 'template', templateId: 'sell360-social' } },
  { nodeId: '1:3810', name: 'Template preview — edit profile', route: { name: 'template', templateId: 'sell360-social' }, params: { modal: 'edit-profile' } },
  { nodeId: '1:4219', name: 'Bookmark success message (with AI banner)', route: dashboard, params: { promo: '1', toast: 'bookmark' } },
  { nodeId: '1:4328', name: 'Bookmark success message', route: dashboard, params: NO_PROMO },
  { nodeId: '1:4010', name: 'Products dropdown', route: dashboard, params: { ...NO_PROMO, open: 'products' } },
  { nodeId: '1:3956', name: 'Categories dropdown', route: dashboard, params: { ...NO_PROMO, open: 'categories' } },
  { nodeId: '1:4165', name: 'Project dropdown', route: dashboard, params: { ...NO_PROMO, open: 'stage' } },
  { nodeId: '1:4263', name: 'Bookmark message — edit profile', route: dashboard, params: { ...NO_PROMO, modal: 'edit-profile', toast: 'bookmark-info' } },
  { nodeId: '1:4127', name: 'Search address', route: dashboard, params: { ...NO_PROMO, aq: '123 Abbeywood' } },
  { nodeId: '1:4086', name: 'Search marketing templates', route: dashboard, params: { ...NO_PROMO, tq: 'Sell360' } },
  { nodeId: '1:3265', name: 'Search result — single category', route: { name: 'search', query: 'Sell360 Playbook' } },
  { nodeId: '1:3282', name: 'Search result — general', route: { name: 'search', query: 'Sell360' } },
  { nodeId: '1:3306', name: 'Search result — empty state', route: { name: 'search', query: 'Open house flyer' } },
  { nodeId: '1:3414', name: 'Empty state — submit material', route: { name: 'search', query: 'Open house flyer' }, params: { modal: 'submit-request' } },
  { nodeId: '1:3536', name: 'Empty state — product type dropdown', route: { name: 'search', query: 'Open house flyer' }, params: { modal: 'submit-request', select: 'product' } },
  { nodeId: '1:3659', name: 'Empty state — category dropdown', route: { name: 'search', query: 'Open house flyer' }, params: { modal: 'submit-request', select: 'category' } },
];

const FIGMA_FILE = 'https://www.figma.com/design/UgiIveCwRYifQFdoXliO2e/Untitled';

export function ScreensPage() {
  return (
    <div className="screens">
      <header className="screens__header">
        <img src={art('logo-navy')} width={118} height={32} alt="Revive" />
        <h1 className="text-h6">Marketing center — screens</h1>
        <p className="text-body2 text-muted">
          Each link opens the app in the state shown by one frame of the Figma section “mc v2”. From there everything is interactive.
        </p>
      </header>
      <ol className="screens__list">
        {SCREENS.map((s) => (
          <li key={s.nodeId} className="screens__item">
            <a className="screens__link" href={href(s.route, s.params)}>
              {s.name}
            </a>
            <a className="screens__node" href={`${FIGMA_FILE}?node-id=${s.nodeId.replace(':', '-')}`} target="_blank" rel="noreferrer">
              Figma {s.nodeId}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
