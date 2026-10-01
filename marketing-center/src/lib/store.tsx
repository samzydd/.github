import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PROFILE } from '../data/catalog';

export type ToastVariant = 'success' | 'info';
export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export type ModalState =
  | { name: 'edit-profile' }
  | { name: 'submit-request'; query?: string; openSelect?: 'product' | 'category' }
  | null;

export type Profile = typeof PROFILE;

interface AppState {
  bookmarks: Set<string>;
  isBookmarked: (templateId: string) => boolean;
  toggleBookmark: (templateId: string) => void;
  toast: Toast | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: () => void;
  modal: ModalState;
  openModal: (modal: Exclude<ModalState, null>) => void;
  closeModal: () => void;
  profile: Profile;
  saveProfile: (profile: Profile) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'revive-mc-bookmarks';
// The third card is bookmarked in the Figma frames.
const DEFAULT_BOOKMARKS = ['sell360-playbook'];

function loadBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // Storage unavailable: fall back to the defaults.
  }
  return new Set(DEFAULT_BOOKMARKS);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);
  const [toast, setToast] = useState<Toast | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [profile, setProfile] = useState<Profile>(PROFILE);
  const toastTimer = useRef<number>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
    } catch {
      // Ignore persistence failures.
    }
  }, [bookmarks]);

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, variant });
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  }, []);

  const toggleBookmark = useCallback(
    (templateId: string) => {
      const adding = !bookmarks.has(templateId);
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (adding) next.add(templateId);
        else next.delete(templateId);
        return next;
      });
      if (adding) showToast('Added to your Bookmarks', 'success');
      else showToast('Removed from your Bookmarks', 'info');
    },
    [bookmarks, showToast],
  );

  const value = useMemo<AppState>(
    () => ({
      bookmarks,
      isBookmarked: (id) => bookmarks.has(id),
      toggleBookmark,
      toast,
      showToast,
      dismissToast,
      modal,
      openModal: setModal,
      closeModal: () => setModal(null),
      profile,
      saveProfile: setProfile,
    }),
    [bookmarks, toggleBookmark, toast, showToast, dismissToast, modal, profile],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
