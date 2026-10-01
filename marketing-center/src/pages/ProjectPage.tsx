import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { TemplateCard } from '../components/Cards';
import { Dropdown, type MenuOption } from '../components/ui/Menu';
import { Badge, Button } from '../components/ui/primitives';
import { productById, projectById, projectMaterials } from '../data/catalog';
import { navigate } from '../lib/router';
import { useScreenParams } from '../lib/screen-params';
import { useApp } from '../lib/store';

type MaterialFilter = 'all' | 'bookmarked' | 'not-bookmarked';
const FILTER_OPTIONS: MenuOption<MaterialFilter>[] = [
  { value: 'all', label: 'All status' },
  { value: 'bookmarked', label: 'Bookmarked' },
  { value: 'not-bookmarked', label: 'Not bookmarked' },
];

export function ProjectPage({ projectId, params }: { projectId: string; params: URLSearchParams }) {
  useScreenParams(params);
  const { isBookmarked } = useApp();
  const [filter, setFilter] = useState<MaterialFilter>('all');
  const project = projectById(projectId);

  if (!project) {
    return (
      <AppShell>
        <div className="empty-note">
          <p>We couldn’t find that project.</p>
          <Button variant="link" onClick={() => navigate({ name: 'dashboard' })}>
            Back to templates
          </Button>
        </div>
      </AppShell>
    );
  }

  const materials = projectMaterials(project)
    .map((template, index) => ({ template, key: `${template.id}-${index}` }))
    .filter(({ template }) => filter === 'all' || (filter === 'bookmarked') === isBookmarked(template.id));

  return (
    <AppShell>
      <div className="project-page">
        <div className="project-page__header">
          <div className="project-page__heading">
            <Button iconLeft="icon-chevron-left" onClick={() => navigate({ name: 'dashboard' })}>
              Back to templates
            </Button>
            <div className="project-page__title">
              <h2 className="text-h6">{project.address}</h2>
              <Badge variant="primary">{productById(project.product).label}</Badge>
            </div>
          </div>
          <Dropdown label="Material status" options={FILTER_OPTIONS} value={filter} onChange={setFilter} align="end" menuWidth={157} />
        </div>
        {materials.length > 0 ? (
          <div className="card-grid">
            {materials.map(({ template, key }) => (
              <TemplateCard key={key} template={template} />
            ))}
          </div>
        ) : (
          <p className="empty-note">No materials match this filter.</p>
        )}
      </div>
    </AppShell>
  );
}
