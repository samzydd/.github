import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './primitives';

interface ModalProps {
  title: string;
  description: string;
  width: number;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

/** The "pop up" dialog: header with title and close button, body, bordered footer. */
export function Modal({ title, description, width, onClose, footer, children, className }: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      // Let open menus inside the dialog handle Escape first.
      if (e.key === 'Escape' && !dialogRef.current?.querySelector('[aria-expanded="true"]')) onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div className="modal-overlay" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={['modal', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        style={{ width }}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal__header">
          <div className="modal__heading">
            <h2 className="modal__title" id={`${id}-title`}>
              {title}
            </h2>
            <p className="modal__description text-muted" id={`${id}-desc`}>
              {description}
            </p>
          </div>
          <Button size="icon" iconLeft="icon-close" aria-label="Close" onClick={onClose} />
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </div>,
    document.body,
  );
}
