import { forwardRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { icon } from '../../lib/assets';

/* ------------------------------------------------------------------ Icon */

interface IconProps {
  name: string;
  size?: 12 | 16 | 20;
  className?: string;
}

/** Renders one of the SVG icons exported from Figma. Decorative by default. */
export function Icon({ name, size = 12, className }: IconProps) {
  return (
    <img
      src={icon(name)}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={['icon', className].filter(Boolean).join(' ')}
    />
  );
}

/* ---------------------------------------------------------------- Button */

export type ButtonVariant = 'outline' | 'primary' | 'secondary' | 'link' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: string;
  iconRight?: string;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', size = 'md', iconLeft, iconRight, block, className, children, type = 'button', ...rest },
  ref,
) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className].filter(Boolean).join(' ');
  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {iconLeft && <Icon name={iconLeft} />}
      {children != null && <span className="btn__label">{children}</span>}
      {iconRight && <Icon name={iconRight} />}
    </button>
  );
});

/* ----------------------------------------------------------------- Badge */

type BadgeVariant = 'secondary' | 'primary' | 'on-image';

export function Badge({ variant = 'secondary', children, className }: { variant?: BadgeVariant; children: ReactNode; className?: string }) {
  return <span className={['badge', `badge--${variant}`, className].filter(Boolean).join(' ')}>{children}</span>;
}

/* ------------------------------------------------------------ ImageAsset */

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface ImageAssetProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Raster image exported from Figma. Raster files are fetched separately
 * (`npm run fetch-assets`); until they exist the slot keeps its size and
 * shows the container background instead of a broken-image icon.
 */
export function ImageAsset({ src, alt, className }: ImageAssetProps) {
  const [missing, setMissing] = useState(false);
  return (
    <img
      src={missing ? TRANSPARENT_PIXEL : src}
      alt={missing ? '' : alt}
      className={['image-asset', className].filter(Boolean).join(' ')}
      data-missing={missing || undefined}
      title={missing ? `Missing asset: ${src.split('/').pop()} (run npm run fetch-assets)` : undefined}
      onError={() => setMissing(true)}
      loading="lazy"
      draggable={false}
    />
  );
}

/* -------------------------------------------------------------- Checkbox */

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox__input" />
      <span className="checkbox__box" aria-hidden="true">
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5.2 4.1 7.3 8 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  );
}

/* ----------------------------------------------------------- SearchInput */

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'md' | 'lg';
  tone?: 'light' | 'dark';
  leftIcon?: string;
  rightIcon?: string;
  wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, SearchInputProps>(function TextInput(
  { size = 'md', tone = 'light', leftIcon, rightIcon, wrapperClassName, className, ...rest },
  ref,
) {
  return (
    <div className={['input', `input--${size}`, `input--${tone}`, wrapperClassName].filter(Boolean).join(' ')}>
      {leftIcon && <Icon name={leftIcon} size={16} />}
      <input ref={ref} className={['input__field', className].filter(Boolean).join(' ')} {...rest} />
      {rightIcon && <Icon name={rightIcon} size={16} />}
    </div>
  );
});
