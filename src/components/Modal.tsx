import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { ModalContent } from './ModalContent';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen,
    onClose,
    modalRef,
  });

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <ModalContent
        title={title}
        onClose={onClose}
        modalRef={modalRef}
        closeLabel="Close"
      >
        {children}
      </ModalContent>
    </div>,
    document.body
  );
};
