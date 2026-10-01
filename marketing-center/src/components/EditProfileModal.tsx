import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { BROKERAGES, CITIES, STATES } from '../data/catalog';
import { image } from '../lib/assets';
import { useApp, type Profile } from '../lib/store';
import { Select } from './ui/Menu';
import { Modal } from './ui/Modal';
import { Button, ImageAsset, TextInput } from './ui/primitives';

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

export function EditProfileModal() {
  const { profile, saveProfile, closeModal, showToast } = useApp();
  const [draft, setDraft] = useState<Profile>(profile);
  const [photo, setPhoto] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const fieldsFilled = (Object.keys(draft) as (keyof Profile)[]).every((k) => String(draft[k]).trim() !== '');
  const dirty = photo !== null || logo !== null || (Object.keys(draft) as (keyof Profile)[]).some((k) => draft[k] !== profile[k]);

  const save = () => {
    saveProfile({ ...draft, displayName: `${draft.firstName} ${draft.lastName}` });
    closeModal();
    showToast('Your profile has been updated', 'success');
  };

  return (
    <Modal
      title="Edit profile"
      description="Keep your marketing profile up to date"
      width={560}
      onClose={closeModal}
      footer={
        <Button variant="primary" disabled={!dirty || !fieldsFilled} onClick={save}>
          Save changes
        </Button>
      }
    >
      <div className="profile-uploads">
        <Upload label="Upload new photo" fallback={image('avatar-michelle-lg')} preview={photo} onPick={setPhoto} />
        <Upload label="Upload new logo" fallback={image('logo-avatar')} preview={logo} onPick={setLogo} />
      </div>
      <div className="form">
        <p className="text-body2 text-muted">All fields are required</p>
        <div className="form__grid">
          <Field label="First name" value={draft.firstName} onChange={(v) => set('firstName', v)} autoComplete="given-name" />
          <Field label="Last name" value={draft.lastName} onChange={(v) => set('lastName', v)} autoComplete="family-name" />
          <Field label="Phone number" type="tel" value={draft.phone} onChange={(v) => set('phone', v)} autoComplete="tel" />
          <Field label="Email" type="email" value={draft.email} onChange={(v) => set('email', v)} autoComplete="email" />
          <Select label="Brokerage" placeholder="Select brokerage" options={toOptions(BROKERAGES)} value={draft.brokerage} onChange={(v) => set('brokerage', v)} />
          <Field label="License" value={draft.license} onChange={(v) => set('license', v)} leftIcon="icon-contact-card" />
          <Select
            label="State"
            placeholder="Select state"
            options={toOptions(STATES)}
            value={draft.state}
            onChange={(v) => setDraft((d) => ({ ...d, state: v, city: CITIES[v]?.[0] ?? '' }))}
          />
          <Select label="City" placeholder="Select city" options={toOptions(CITIES[draft.state] ?? [])} value={draft.city} onChange={(v) => set('city', v)} />
        </div>
      </div>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  leftIcon?: string;
}

function Field({ label, value, onChange, type = 'text', autoComplete, leftIcon }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <TextInput size="lg" type={type} value={value} autoComplete={autoComplete} leftIcon={leftIcon} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

interface UploadProps {
  label: string;
  fallback: string;
  preview: string | null;
  onPick: (url: string) => void;
}

function Upload({ label, fallback, preview, onPick }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPick(URL.createObjectURL(file));
  };

  return (
    <div className="profile-uploads__item">
      <span className="profile-uploads__avatar">
        {preview ? <img src={preview} alt="" /> : <ImageAsset src={fallback} alt="" />}
      </span>
      <Button size="sm" onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} aria-label={label} />
    </div>
  );
}
