import type { ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
  searchQuery?: string;
  openAddressSuggestions?: boolean;
}

/** Sidebar + "Marketing center" header + scrollable main section. */
export function AppShell({ children, searchQuery, openAddressSuggestions }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <PageHeader key={searchQuery ?? ''} initialQuery={searchQuery} openSuggestions={openAddressSuggestions} />
        <main className="main-section">{children}</main>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  level?: 'section' | 'subsection';
}

/** "Pro Blocks / Table Header": title, optional description, right-aligned actions. */
export function SectionHeader({ id, title, description, actions, level = 'section' }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__text">
        <h2 id={id} className={level === 'section' ? 'text-h6' : 'section-header__subtitle'}>{title}</h2>
        {description && <p className="text-body2 text-muted">{description}</p>}
      </div>
      {actions && <div className="section-header__actions">{actions}</div>}
    </div>
  );
}
