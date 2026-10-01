import { art, image } from '../lib/assets';
import { href } from '../lib/router';
import { useApp } from '../lib/store';
import { Icon, ImageAsset } from './ui/primitives';

const NAV = [
  { label: 'Dashboard', icon: 'icon-objects-column' },
  { label: 'Inbox', icon: 'icon-email', badge: 8 },
  { label: 'Properties', icon: 'icon-home' },
  { label: 'Revive AI', icon: 'icon-ai-generate-sidebar', chevron: true },
  { label: 'Seller Leads', icon: 'icon-team' },
  { label: 'Marketing center', icon: 'icon-announcement', active: true },
  { label: 'Resources', icon: 'icon-reading' },
];

export function Sidebar() {
  const { profile } = useApp();
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__header">
        <a href={href({ name: 'dashboard' })} className="sidebar__logo" aria-label="Revive home">
          <img src={art('logo-white')} width={118} height={32} alt="Revive" />
        </a>
        <button type="button" className="sidebar__toggle" aria-label="Collapse sidebar">
          <Icon name="icon-sidebar" size={20} />
        </button>
      </div>

      <div className="sidebar__body">
        <div className="sidebar__search">
          <label className="input input--md input--dark">
            <Icon name="icon-search-sidebar" size={16} />
            <span className="visually-hidden">Search</span>
            <input className="input__field" placeholder="Search" />
          </label>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((item) => {
            const content = (
              <>
                <Icon name={item.icon} size={16} />
                <span className="sidebar__item-label">{item.label}</span>
                {item.badge != null && <span className="sidebar__badge">{item.badge}</span>}
                {item.chevron && <Icon name="icon-chevron-right-sidebar" size={16} />}
              </>
            );
            // Only the Marketing center lives in this prototype; other entries are inert.
            return item.active ? (
              <a key={item.label} href={href({ name: 'dashboard' })} className="sidebar__item sidebar__item--active" aria-current="page">
                {content}
              </a>
            ) : (
              <button key={item.label} type="button" className="sidebar__item">
                {content}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__app-promo">
          <ImageAsset src={image('app-qr')} alt="QR code to download the Revive app" className="sidebar__qr" />
          <div className="sidebar__app-text">
            <p className="sidebar__app-title">Download the Revive App</p>
            <p className="sidebar__app-copy">
              A better experience is waiting for you.
              <br />
              <button type="button" className="sidebar__app-link">
                Explore more
              </button>
            </p>
          </div>
        </div>
        <img src={art('icons/sidebar-divider')} width={248} height={1} alt="" className="sidebar__divider" />
        <button type="button" className="sidebar__user">
          <span className="sidebar__avatar">
            <ImageAsset src={image('avatar-michelle')} alt="" />
          </span>
          <span className="sidebar__user-text">
            <span className="sidebar__user-name">{profile.displayName}</span>
            <span className="sidebar__user-role">{profile.role}</span>
          </span>
          <Icon name="icon-chevron-right-footer" size={16} />
        </button>
      </div>
    </aside>
  );
}
