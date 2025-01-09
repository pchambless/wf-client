import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalComponent = ({
  isOpen,
  onRequestClose,
  contentLabel,
  title,
  children,
  className = "fixed inset-0 flex items-center justify-center",
  overlayClassName = "fixed inset-0 bg-gray-800 bg-opacity-75",
  closeButtonText = "Close",
  closeButtonClassName = "px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className={className}
      overlayClassName={overlayClassName}
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
        <div className="mb-4">{children}</div>
        <button
          onClick={onRequestClose}
          className={closeButtonClassName}
        >
          {closeButtonText}
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
