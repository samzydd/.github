import { useId, useState } from 'react';
import { useApp } from '../lib/store';
import { Select, type MenuOption } from './ui/Menu';
import { Modal } from './ui/Modal';
import { Button } from './ui/primitives';

const PRODUCT_TYPES: MenuOption<string>[] = ['All products', 'Renovate to sell', 'Renovate to stay', 'Sell 360', 'Flip 360', 'QR Codes'].map((v) => ({ value: v, label: v }));
const CATEGORIES: MenuOption<string>[] = ['All categories', 'Socials', 'One pager', 'Playbook', 'Postcard'].map((v) => ({ value: v, label: v }));

interface SubmitRequestModalProps {
  openSelect?: 'product' | 'category';
}

export function SubmitRequestModal({ openSelect }: SubmitRequestModalProps) {
  const { closeModal, showToast } = useApp();
  const [product, setProduct] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const reasonId = useId();

  const send = () => {
    closeModal();
    showToast('Your request has been sent', 'success');
  };

  return (
    <Modal
      title="Submit request"
      description="Keep your marketing profile up to date"
      width={440}
      className="modal--request"
      onClose={closeModal}
      footer={
        <Button variant="primary" block disabled={!product || !category} onClick={send}>
          Send request
        </Button>
      }
    >
      <div className="form form--stack">
        <Select label="Select product type" placeholder="Select product type" options={PRODUCT_TYPES} value={product} onChange={setProduct} defaultOpen={openSelect === 'product'} />
        <Select label="Select category" placeholder="Select product category" options={CATEGORIES} value={category} onChange={setCategory} defaultOpen={openSelect === 'category'} />
        <div className="field">
          <label className="field__label" htmlFor={reasonId}>
            Reason for submitting (optional)
          </label>
          <textarea id={reasonId} className="textarea" placeholder="what’s your reason for requesting this material" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
