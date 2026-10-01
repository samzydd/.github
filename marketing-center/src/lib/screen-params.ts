import { useEffect, useState } from 'react';
import { useApp } from './store';

/**
 * Deep-link parameters used by the Screens index to open each Figma frame in
 * its exact state (open menus, modals, toasts…). They are read once when a
 * page mounts; afterwards the UI behaves normally.
 */
export interface ScreenParams {
  noProjects: boolean;
  promo: boolean | null;
  expanded: boolean;
  open: string | null;
  templateQuery: string;
  addressQuery: string;
  select: 'product' | 'category' | undefined;
}

export function useScreenParams(params: URLSearchParams): ScreenParams {
  const { openModal, showToast } = useApp();
  const [initial] = useState<ScreenParams>(() => ({
    noProjects: params.get('projects') === 'none',
    promo: params.has('promo') ? params.get('promo') === '1' : null,
    expanded: params.get('expanded') === '1',
    open: params.get('open'),
    templateQuery: params.get('tq') ?? '',
    addressQuery: params.get('aq') ?? '',
    select: (params.get('select') as 'product' | 'category' | null) ?? undefined,
  }));

  useEffect(() => {
    const modal = params.get('modal');
    if (modal === 'edit-profile') openModal({ name: 'edit-profile' });
    if (modal === 'submit-request') openModal({ name: 'submit-request', openSelect: initial.select });
    const toast = params.get('toast');
    if (toast === 'bookmark') showToast('Added to your Bookmarks', 'success');
    if (toast === 'bookmark-info') showToast('Added to your Bookmarks', 'info');
    // Only on mount: these parameters describe the initial state.
  }, []);

  return initial;
}
