import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import { Button, Icon } from './primitives';

export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, onDismiss]);
}

export interface MenuOption<T extends string> {
  value: T;
  label: string;
}

interface MenuListProps<T extends string> {
  id: string;
  options: MenuOption<T>[];
  value: T | null;
  onSelect: (value: T) => void;
  className?: string;
  style?: CSSProperties;
}

/** The "DropdownMenu / Menu" list: plain rows with a check on the selected one. */
export function MenuList<T extends string>({ id, options, value, onSelect, className, style }: MenuListProps<T>) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const selected = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    (selected ?? listRef.current?.querySelector<HTMLElement>('[role="option"]'))?.focus();
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[Math.min(items.length - 1, index + 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[Math.max(0, index - 1)]?.focus();
    }
  };

  return (
    <ul id={id} role="listbox" ref={listRef} className={['menu', className].filter(Boolean).join(' ')} style={style} onKeyDown={onKeyDown}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <li
            key={option.value}
            role="option"
            aria-selected={selected}
            tabIndex={-1}
            className="menu__item"
            onClick={() => onSelect(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(option.value);
              }
            }}
          >
            <span className="menu__label">{option.label}</span>
            {selected && <Icon name="icon-check" size={16} />}
          </li>
        );
      })}
    </ul>
  );
}

interface DropdownProps<T extends string> {
  options: MenuOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Width of the open menu; defaults to the trigger's width. */
  menuWidth?: number;
  align?: 'start' | 'end';
  defaultOpen?: boolean;
  buttonSize?: 'md' | 'lg';
  label: string;
}

/** Outline filter button ("All products", "Active projects", …) with a menu. */
export function Dropdown<T extends string>({ options, value, onChange, menuWidth, align = 'start', defaultOpen = false, buttonSize = 'md', label }: DropdownProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => setOpen(false);
  useDismiss(ref, open, close);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className={`dropdown dropdown--${align}`} ref={ref}>
      <Button
        ref={triggerRef}
        size={buttonSize}
        iconRight={open ? 'icon-chevron-up' : 'icon-chevron-down'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`${label}: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        {current.label}
      </Button>
      {open && (
        <MenuList
          id={id}
          options={options}
          value={value}
          className="dropdown__menu"
          style={menuWidth ? { width: menuWidth } : undefined}
          onSelect={(v) => {
            onChange(v);
            close();
            triggerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

interface SelectProps<T extends string> {
  label: string;
  placeholder: string;
  options: MenuOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  defaultOpen?: boolean;
}

/** Form select styled as the Figma input with a chevron. */
export function Select<T extends string>({ label, placeholder, options, value, onChange, defaultOpen = false }: SelectProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => setOpen(false);
  useDismiss(ref, open, close);
  const current = options.find((o) => o.value === value);

  return (
    <div className="field" ref={ref}>
      <span className="field__label" id={`${id}-label`}>
        {label}
      </span>
      <div className="select">
        <button
          ref={triggerRef}
          type="button"
          className="input input--lg input--light select__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          aria-controls={open ? id : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="select__value">{current?.label ?? placeholder}</span>
          <Icon name={open ? 'icon-chevron-up-16' : 'icon-chevron-down-16'} size={16} />
        </button>
        {open && (
          <MenuList
            id={id}
            options={options}
            value={value}
            className="select__menu"
            onSelect={(v) => {
              onChange(v);
              close();
              triggerRef.current?.focus();
            }}
          />
        )}
      </div>
    </div>
  );
}
