import { useState } from 'react';
import { TEMPLATES } from '../data/catalog';
import { navigate } from '../lib/router';
import { searchAddresses } from '../lib/search';
import { useApp } from '../lib/store';
import { Autocomplete } from './Autocomplete';
import { Button } from './ui/primitives';

interface PageHeaderProps {
  initialQuery?: string;
  openSuggestions?: boolean;
}

/** "Marketing center" header with the global address search and profile button. */
export function PageHeader({ initialQuery = '', openSuggestions = false }: PageHeaderProps) {
  const { openModal } = useApp();
  const [query, setQuery] = useState(initialQuery);

  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 className="text-h5">Marketing center</h1>
        <p className="text-body2 text-muted">Curated brand-approved templates for your own marketing purposes.</p>
      </div>
      <div className="page-header__actions">
        <Autocomplete
          className="page-header__search"
          size="lg"
          label="Search address"
          placeholder="Search address"
          value={query}
          defaultOpen={openSuggestions}
          onValueChange={setQuery}
          getSuggestions={(q) =>
            searchAddresses(q).map((p) => ({
              id: p.id,
              label: p.address,
              // The design pairs address suggestions with the project's lead material.
              thumbnail: TEMPLATES[0].searchThumbnail,
            }))
          }
          onPick={(s) => navigate({ name: 'project', projectId: s.id })}
          onSubmit={(q) => (q ? navigate({ name: 'search', query: q }) : navigate({ name: 'dashboard' }))}
        />
        <Button size="lg" iconLeft="icon-edit" onClick={() => openModal({ name: 'edit-profile' })}>
          Edit profile information
        </Button>
      </div>
    </header>
  );
}
