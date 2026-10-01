import { EditProfileModal } from './components/EditProfileModal';
import { SubmitRequestModal } from './components/SubmitRequestModal';
import { ToastViewport } from './components/ui/Toast';
import { useLocation } from './lib/router';
import { AppProvider, useApp } from './lib/store';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectPage } from './pages/ProjectPage';
import { ScreensPage } from './pages/ScreensPage';
import { SearchPage } from './pages/SearchPage';
import { TemplatePage } from './pages/TemplatePage';

function Routes() {
  const { route, params } = useLocation();
  // Keying by the full hash remounts the page so deep-link state is re-read.
  const key = window.location.hash;
  switch (route.name) {
    case 'search':
      return <SearchPage key={key} query={route.query} params={params} />;
    case 'project':
      return <ProjectPage key={key} projectId={route.projectId} params={params} />;
    case 'template':
      return <TemplatePage key={key} templateId={route.templateId} params={params} />;
    case 'screens':
      return <ScreensPage />;
    default:
      return <DashboardPage key={key} params={params} />;
  }
}

function Modals() {
  const { modal } = useApp();
  if (modal?.name === 'edit-profile') return <EditProfileModal />;
  if (modal?.name === 'submit-request') return <SubmitRequestModal openSelect={modal.openSelect} />;
  return null;
}

export function App() {
  return (
    <AppProvider>
      <Routes />
      <Modals />
      <ToastViewport />
    </AppProvider>
  );
}
