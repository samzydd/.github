import { AppShell, SectionHeader } from '../components/AppShell';
import { ProjectCard, TemplateCard } from '../components/Cards';
import { Button } from '../components/ui/primitives';
import { TEMPLATES } from '../data/catalog';
import { art } from '../lib/assets';
import { navigate } from '../lib/router';
import { useScreenParams } from '../lib/screen-params';
import { searchProjects, searchTemplates } from '../lib/search';
import { useApp } from '../lib/store';

export function SearchPage({ query, params }: { query: string; params: URLSearchParams }) {
  useScreenParams(params);
  const projects = searchProjects(query);
  const templates = searchTemplates(query);
  const sectioned = projects.length > 0 && templates.length > 0;

  return (
    <AppShell searchQuery={query}>
      {projects.length === 0 && templates.length === 0 ? (
        <EmptyResults query={query} />
      ) : (
        <div className="search-results">
          <p className="search-results__title">
            Search results for <strong>“{query}”</strong>
          </p>
          {projects.length > 0 && (
            <section className="search-results__group" aria-label="Projects">
              {sectioned && <SectionHeader title="Your ongoing Revive projects" level="subsection" />}
              <div className="card-grid card-grid--projects">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          )}
          {templates.length > 0 && (
            <section className="search-results__group" aria-label="Marketing materials">
              {sectioned && <SectionHeader title="Marketing materials" level="subsection" />}
              <div className="card-grid">
                {templates.map((t) => (
                  <TemplateCard key={t.id} template={t} longTitle />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}

function EmptyResults({ query }: { query: string }) {
  const { openModal } = useApp();
  return (
    <div className="search-empty">
      <div className="search-empty__state">
        <img src={art('illustration-empty')} width={69} height={69} alt="" />
        <p className="search-empty__message">
          No materials found for <strong>“{query}”</strong>
          <br />
          You can request this material.
        </p>
        <Button className="btn--raised" iconRight="icon-arrow-right" onClick={() => openModal({ name: 'submit-request', query })}>
          Submit a request
        </Button>
        <Button variant="link" onClick={() => navigate({ name: 'dashboard' })}>
          Clear search result
        </Button>
      </div>
      <section className="search-results__group" aria-label="Explore related materials">
        <SectionHeader title="Explore related materials" level="subsection" />
        <div className="card-grid">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} longTitle />
          ))}
        </div>
      </section>
    </div>
  );
}
