import { useId, useRef, useState } from 'react';
import { useDismiss } from './ui/Menu';
import { ImageAsset, TextInput } from './ui/primitives';

export interface Suggestion {
  id: string;
  label: string;
  thumbnail: string;
}

interface AutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Called with the trimmed value when Enter is pressed without a highlighted suggestion. */
  onSubmit: (value: string) => void;
  onPick: (suggestion: Suggestion) => void;
  getSuggestions: (value: string) => Suggestion[];
  placeholder: string;
  label: string;
  size?: 'md' | 'lg';
  className?: string;
  defaultOpen?: boolean;
}

/** Search input with the "Search" suggestion popover (thumbnail + label rows). */
export function Autocomplete({ value, onValueChange, onSubmit, onPick, getSuggestions, placeholder, label, size = 'md', className, defaultOpen = false }: AutocompleteProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  useDismiss(ref, open, close);

  const suggestions = value.trim() ? getSuggestions(value) : [];
  const showList = open && suggestions.length > 0;

  const pick = (s: Suggestion) => {
    close();
    onPick(s);
  };

  return (
    <div className={['autocomplete', className].filter(Boolean).join(' ')} ref={ref}>
      <TextInput
        size={size}
        leftIcon="icon-search"
        placeholder={placeholder}
        aria-label={label}
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? id : undefined}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${id}-${active}` : undefined}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && suggestions.length) {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(suggestions.length - 1, i + 1));
          } else if (e.key === 'ArrowUp' && suggestions.length) {
            e.preventDefault();
            setActive((i) => Math.max(-1, i - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (showList && active >= 0) pick(suggestions[active]);
            else {
              close();
              onSubmit(value.trim());
            }
          }
        }}
      />
      {showList && (
        <ul className="suggestions" role="listbox" id={id}>
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === active}
              className="suggestions__item"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => pick(s)}
              onPointerEnter={() => setActive(i)}
            >
              <span className="suggestions__thumb">
                <ImageAsset src={s.thumbnail} alt="" />
              </span>
              <span className="suggestions__label">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
