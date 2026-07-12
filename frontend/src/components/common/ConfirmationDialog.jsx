import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${danger ? 'bg-danger/20' : 'bg-warning/20'}`}>
            <AlertTriangle size={18} className={danger ? 'text-danger' : 'text-warning'} />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={danger ? 'btn-danger text-sm' : 'btn-primary text-sm'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
