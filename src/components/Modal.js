import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import useLogger from '../hooks/useLogger';
import Table from '../components/Table';
import useModalManager from '../utils/modalManager';
import { setVars } from '../utils/useExternalStore';

const Modal = ({ isOpen, onClose, title, content, contentType, listEvent }) => {
  const logAndTime = useLogger('Modal');
  const { modalState } = useModalManager();

  useEffect(() => {
    ReactModal.setAppElement('#root');
  }, []);

  const handleRowClick = (selectedItem) => {
    const config = modalState.config;
    if (config) {
      const selectedVars = {
        [config.varName]: selectedItem[config.id],
        [config.labelName]: selectedItem[config.label]
      };
      setVars(selectedVars);
      logAndTime(`Variables set: ${JSON.stringify(selectedVars)}`);
      onClose();
    }
  };

  logAndTime('Rendering Modal', { isOpen, modalState });

  return ReactDOM.createPortal(
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title || ''}
      className="fixed inset-0 flex items-center justify-center z-modal"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="w-11/12 max-w-2xl p-6 bg-white border-4 rounded-lg shadow-xl border-modal-brdr">
        <h2 className="mb-4 text-2xl font-bold text-modal-brdr">{title || 'Modal'}</h2>
        <div className="mb-6">
          {contentType === 'message' && <p>{content}</p>}
          {contentType === 'table' && (
            <Table
              listEvent={listEvent}
              onRowClick={handleRowClick}
            />
          )}
        </div>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-white transition duration-300 rounded bg-modal-brdr hover:bg-opacity-80"
          >
            Close
          </button>
        </div>
      </div>
    </ReactModal>,
    document.body
  );
};

export default Modal;
