import { categoryById, productById, stageById, type Project, type Template } from '../data/catalog';
import { href, navigate } from '../lib/router';
import { useApp } from '../lib/store';
import { Badge, Button, Icon, ImageAsset } from './ui/primitives';

interface TemplateCardProps {
  template: Template;
  /** Use the long name (search results) instead of the short card name. */
  longTitle?: boolean;
}

/** "Card protype": template thumbnail, bookmark toggle, title and category badge. */
export function TemplateCard({ template, longTitle }: TemplateCardProps) {
  const { isBookmarked, toggleBookmark } = useApp();
  const bookmarked = isBookmarked(template.id);
  const title = longTitle ? template.fullName : template.name;

  return (
    <article className="template-card">
      <a className="template-card__link" href={href({ name: 'template', templateId: template.id })}>
        <div className="template-card__thumb">
          <ImageAsset src={template.thumbnail} alt={`${template.fullName} preview`} />
        </div>
        <div className="template-card__description">
          <h3 className="template-card__title">{title}</h3>
          <Badge>{categoryById(template.category).label}</Badge>
        </div>
      </a>
      <button
        type="button"
        className={['template-card__bookmark', bookmarked && 'template-card__bookmark--active'].filter(Boolean).join(' ')}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
        onClick={() => toggleBookmark(template.id)}
      >
        <Icon name={bookmarked ? 'icon-save-active' : 'icon-save'} />
      </button>
    </article>
  );
}

/** Project card ("Templates" instance): photo with address, status, template count. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-card__media">
        <ImageAsset src={project.image} alt={`Photo of ${project.address}`} />
        <Badge variant="on-image" className="project-card__product">
          {productById(project.product).badge}
        </Badge>
        <div className="project-card__address">
          <h3 className="project-card__street">{project.address}</h3>
          <p className="project-card__city">
            <Icon name="icon-map-pin" />
            {project.cityLine}
          </p>
        </div>
      </div>
      <dl className="project-card__stats">
        <div>
          <dt>Status</dt>
          <dd>{stageById(project.stage).label}</dd>
        </div>
        <div>
          <dt>Templates</dt>
          <dd>{project.templateCount}</dd>
        </div>
      </dl>
      <div className="project-card__footer">
        <Button variant="secondary" size="sm" block onClick={() => navigate({ name: 'project', projectId: project.id })}>
          View project templates
        </Button>
      </div>
    </article>
  );
}
