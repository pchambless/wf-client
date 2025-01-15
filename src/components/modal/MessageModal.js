import React from 'react';
import ReactModal from 'react-modal';
import { useModalContext } from '../../context/ModalContext';

ReactModal.setAppElement('#root');

const MessageModal = ({ isOpen: propIsOpen, onRequestClose: propOnRequestClose, title: propTitle, message: propMessage }) => {
  const { modalIsOpen: contextIsOpen, modalConfig, closeModal } = useModalContext();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onRequestClose = propOnRequestClose || closeModal;
  const title = propTitle || modalConfig.title;
  const message = propMessage || modalConfig.message;

  if (!isOpen || (modalConfig.type !== 'message' && !propIsOpen)) {
    return null;
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="fixed inset-0 z-50 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          {modalConfig.showCancel && (
            <button 
              onClick={onRequestClose}
              className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300"
            >
              {modalConfig.cancelText || 'Cancel'}
            </button>
          )}
          <button 
            onClick={onRequestClose}
            className="px-4 py-2 text-white transition-colors rounded bg-primaryGreen hover:bg-opacity-90"
          >
            {modalConfig.confirmText || 'Close'}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default MessageModal;
