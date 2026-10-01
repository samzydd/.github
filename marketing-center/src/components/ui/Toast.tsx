import { useApp } from '../../lib/store';
import { Icon } from './primitives';

/** The "Alert" toast shown after bookmarking (success) or other notices (info). */
export function ToastViewport() {
  const { toast, dismissToast } = useApp();
  return (
    <div className="toast-viewport" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`toast toast--${toast.variant}`} role="status" onClick={dismissToast}>
          <Icon name={toast.variant === 'success' ? 'icon-success' : 'icon-info'} size={16} />
          <span className="toast__message">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
