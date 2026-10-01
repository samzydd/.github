import { useState } from 'react';
import { AppShell, SectionHeader } from '../components/AppShell';
import { Autocomplete } from '../components/Autocomplete';
import { ProjectCard, TemplateCard } from '../components/Cards';
import { Dropdown, type MenuOption } from '../components/ui/Menu';
import { Button, Checkbox, Icon } from '../components/ui/primitives';
import { CATEGORIES, PRODUCTS, PROJECTS, PROJECT_STAGES, PROJECT_STATUSES, TEMPLATES, type CategoryId, type ProductId, type ProjectStage, type ProjectStatus } from '../data/catalog';
import { art } from '../lib/assets';
import { navigate } from '../lib/router';
import { useScreenParams } from '../lib/screen-params';
import { searchTemplates } from '../lib/search';
import { useApp } from '../lib/store';

const PROMO_KEY = 'revive-mc-promo-dismissed';
const COLLAPSED_PROJECTS = 4;

export function DashboardPage({ params }: { params: URLSearchParams }) {
  const screen = useScreenParams(params);
  const [promoVisible, setPromoVisible] = useState(() => {
    if (screen.promo !== null) return screen.promo;
    try {
      return sessionStorage.getItem(PROMO_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const dismissPromo = () => {
    setPromoVisible(false);
    try {
      sessionStorage.setItem(PROMO_KEY, '1');
    } catch {
      // Ignore persistence failures.
    }
  };

  return (
    <AppShell searchQuery={screen.addressQuery} openAddressSuggestions={!!screen.addressQuery}>
      <div className="dashboard">
        {screen.noProjects ? (
          <NoProjectsBanner />
        ) : (
          <div className="dashboard__projects-block">
            {promoVisible && <PromoBanner onDismiss={dismissPromo} />}
            <ProjectsSection expandedInitially={screen.expanded} openMenu={screen.open} />
          </div>
        )}
        <TemplatesSection initialQuery={screen.templateQuery} openMenu={screen.open} />
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------ Banners */

function PromoBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="banner banner--muted" role="region" aria-label="Revive AI">
      <Icon name="icon-ai-generate" size={16} />
      <p className="banner__text banner__text--strong">Try Revive’s AI’s free, custom branded property analyzer</p>
      <Button iconRight="icon-arrow-right">Try Revive AI</Button>
      <Button size="icon" iconLeft="icon-close" aria-label="Dismiss" onClick={onDismiss} />
    </div>
  );
}

function NoProjectsBanner() {
  return (
    <div className="banner" role="region" aria-label="Revive projects">
      <img src={art('illustration-empty')} width={20} height={20} alt="" className="banner__illustration" />
      <p className="banner__text">
        <strong>Revive projects:</strong> You currently don’t have any ongoing project with Revive. Have a project in mind?
      </p>
      <Button iconLeft="icon-add">Start a project with Revive</Button>
    </div>
  );
}

/* ----------------------------------------------------------- Projects */

type StageFilter = 'active' | ProjectStage;
type StatusFilter = 'all' | ProjectStatus;

const STAGE_OPTIONS: MenuOption<StageFilter>[] = [{ value: 'active', label: 'Active projects' }, ...PROJECT_STAGES.map((s) => ({ value: s.id, label: s.label }))];
const STATUS_OPTIONS: MenuOption<StatusFilter>[] = [{ value: 'all', label: 'All Status' }, ...PROJECT_STATUSES.map((s) => ({ value: s.id, label: s.label }))];

function ProjectsSection({ expandedInitially, openMenu }: { expandedInitially: boolean; openMenu: string | null }) {
  const [stage, setStage] = useState<StageFilter>('active');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [expanded, setExpanded] = useState(expandedInitially);

  const filtered = PROJECTS.filter((p) => (stage === 'active' || p.stage === stage) && (status === 'all' || p.status === status));
  const visible = expanded ? filtered : filtered.slice(0, COLLAPSED_PROJECTS);
  const canToggle = filtered.length > COLLAPSED_PROJECTS;

  return (
    <section className="section" aria-labelledby="projects-title">
      <SectionHeader
        id="projects-title"
        title="Marketing materials for your Revive projects"
        description="Get marketing materials from your Revive projects"
        actions={
          <>
            <Dropdown label="Project stage" options={STAGE_OPTIONS} value={stage} onChange={setStage} defaultOpen={openMenu === 'stage'} buttonSize="lg" menuWidth={157} />
            <Dropdown label="Project status" options={STATUS_OPTIONS} value={status} onChange={setStatus} defaultOpen={openMenu === 'status'} buttonSize="lg" align="end" menuWidth={157} />
          </>
        }
      />
      {visible.length > 0 ? (
        <div className="card-grid card-grid--projects">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="empty-note">No projects match these filters.</p>
      )}
      {canToggle && (
        <Button variant="secondary" size="lg" block iconRight={expanded ? 'icon-chevron-up' : 'icon-chevron-down'} onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
          {expanded ? 'Show less projects' : 'Show all projects'}
        </Button>
      )}
    </section>
  );
}

/* ---------------------------------------------------------- Templates */

const PRODUCT_OPTIONS: MenuOption<'all' | ProductId>[] = [{ value: 'all', label: 'All products' }, ...PRODUCTS.map((p) => ({ value: p.id, label: p.label }))];
const CATEGORY_OPTIONS: MenuOption<'all' | CategoryId>[] = [{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.label }))];

function TemplatesSection({ initialQuery, openMenu }: { initialQuery: string; openMenu: string | null }) {
  const { isBookmarked } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [product, setProduct] = useState<'all' | ProductId>('all');
  const [category, setCategory] = useState<'all' | CategoryId>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const matchingIds = appliedQuery ? new Set(searchTemplates(appliedQuery).map((t) => t.id)) : null;
  const templates = TEMPLATES.filter(
    (t) =>
      (product === 'all' || t.product === product) &&
      (category === 'all' || t.category === category) &&
      (!bookmarkedOnly || isBookmarked(t.id)) &&
      (!matchingIds || matchingIds.has(t.id)),
  );

  const resetFilters = () => {
    setQuery('');
    setAppliedQuery('');
    setProduct('all');
    setCategory('all');
    setBookmarkedOnly(false);
  };

  return (
    <section className="section" aria-labelledby="templates-title">
      <SectionHeader id="templates-title" title="Marketing material templates" description="Explore ready-to-use marketing templates to promote your brand." />
      <div className="toolbar">
        <div className="toolbar__filters">
          <Autocomplete
            className="toolbar__search"
            label="Search templates"
            placeholder="Search templates"
            value={query}
            defaultOpen={!!initialQuery}
            onValueChange={(v) => {
              setQuery(v);
              if (!v.trim()) setAppliedQuery('');
            }}
            getSuggestions={(q) => searchTemplates(q).slice(0, 4).map((t) => ({ id: t.id, label: t.fullName, thumbnail: t.searchThumbnail }))}
            onPick={(s) => navigate({ name: 'template', templateId: s.id })}
            onSubmit={setAppliedQuery}
          />
          <Dropdown label="Product" options={PRODUCT_OPTIONS} value={product} onChange={setProduct} defaultOpen={openMenu === 'products'} menuWidth={188} />
          <Dropdown label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} defaultOpen={openMenu === 'categories'} menuWidth={188} />
        </div>
        <Checkbox label="Show bookmarked materials" checked={bookmarkedOnly} onChange={setBookmarkedOnly} />
      </div>
      {templates.length > 0 ? (
        <div className="card-grid">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      ) : (
        <div className="empty-note">
          <p>No templates match your filters.</p>
          <Button variant="link" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}
