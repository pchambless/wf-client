import React from 'react';
import ReactModal from 'react-modal';
import Table from '../Table';
import useLogger from '../../hooks/useLogger';

ReactModal.setAppElement('#root');

const MdlTable = ({ isOpen, onRequestClose, title, content, onRowClick }) => {
  const logAndTime = useLogger('MdlTable');

  logAndTime('MdlTable rendered', { isOpen, title });
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="fixed inset-0 flex items-center justify-center z-modal"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-4xl p-6 mx-4 bg-white rounded-lg shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-primaryGreen">{title}</h2>
        <div className="max-h-[60vh] overflow-y-auto mb-4">
          <Table
            listEvent={content.listEvent}
            columnMapping={content.columnMapping}
            idField={content.id}
            labelField={content.label}
            onRowClick={onRowClick}
          />
        </div>
        <div className="flex justify-end">
          <button 
            onClick={onRequestClose}
            className="px-4 py-2 text-white transition-colors rounded bg-primaryGreen hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default MdlTable;
