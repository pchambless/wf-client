import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import useLogger from '../../hooks/useLogger';

ReactModal.setAppElement('#root');

const MdlMessage = ({ isOpen, onRequestClose, title, message }) => {
  const logAndTime = useLogger('MdlMessage');

  useEffect(() => {
    logAndTime('MdlMessage rendered', { isOpen, title, message });
  }, [isOpen, title, message, logAndTime]);

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
        <button 
          onClick={onRequestClose}
          className="px-4 py-2 text-white transition-colors rounded bg-primaryGreen hover:bg-opacity-90"
        >
          Close
        </button>
      </div>
    </ReactModal>
  );
};

export default MdlMessage;
