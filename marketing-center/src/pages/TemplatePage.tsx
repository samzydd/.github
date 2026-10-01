import { Button, Icon, ImageAsset } from '../components/ui/primitives';
import { categoryById, templateById } from '../data/catalog';
import { art } from '../lib/assets';
import { href, navigate } from '../lib/router';
import { useScreenParams } from '../lib/screen-params';
import { useApp } from '../lib/store';

export function TemplatePage({ templateId, params }: { templateId: string; params: URLSearchParams }) {
  useScreenParams(params);
  const { isBookmarked, toggleBookmark, openModal, showToast } = useApp();
  const template = templateById(templateId);

  if (!template) {
    return (
      <div className="template-page">
        <TemplateLogo />
        <div className="empty-note">
          <p>We couldn’t find that template.</p>
          <Button variant="link" onClick={() => navigate({ name: 'dashboard' })}>
            Back to Marketing center
          </Button>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(template.id);
  const title = `${categoryById(template.category).singular}: ${template.name}`;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard', 'info');
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  return (
    <div className="template-page">
      <TemplateLogo />
      <header className="template-page__header">
        <div className="template-page__text">
          <h1 className="text-h6">{title}</h1>
          <p className="template-page__hint">
            <span className="text-body2 text-muted">If your information doesn’t look right, you can update it.</span>
            <Button variant="link" size="sm" iconLeft="icon-edit-link" onClick={() => openModal({ name: 'edit-profile' })}>
              Edit profile information
            </Button>
          </p>
        </div>
        <div className="template-page__actions">
          <Button size="lg" className="btn--compact" iconLeft={bookmarked ? 'icon-save-active' : 'icon-save-outline'} aria-pressed={bookmarked} onClick={() => toggleBookmark(template.id)}>
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button size="lg" className="btn--compact" iconLeft="icon-share-network" onClick={share}>
            Share
          </Button>
          <a className="btn btn--primary btn--lg" href={template.preview} download={`${template.id}.png`}>
            <Icon name="icon-import" />
            <span className="btn__label">Download</span>
          </a>
        </div>
      </header>
      <div className="template-page__canvas">
        <ImageAsset src={template.preview} alt={`${template.fullName} artwork`} className="template-page__artwork" />
      </div>
    </div>
  );
}

function TemplateLogo() {
  return (
    <a href={href({ name: 'dashboard' })} className="template-page__logo" aria-label="Back to Marketing center">
      <img src={art('logo-navy')} width={118} height={32} alt="Revive" />
    </a>
  );
}
