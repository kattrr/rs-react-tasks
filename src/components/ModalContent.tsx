import React from 'react';
import { CloseIcon } from './CloseIcon';

interface ModalContentProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  modalRef: React.RefObject<HTMLDivElement>;
  closeLabel: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  title,
  onClose,
  children,
  modalRef,
  closeLabel,
}) => (
  <div
    ref={modalRef}
    className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 mx-4"
    tabIndex={-1}
    role="document"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={closeLabel}
      >
        <CloseIcon />
      </button>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);
