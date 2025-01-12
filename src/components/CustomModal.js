// CustomModal.js
import React from 'react';
import ReactModal from 'react-modal';
import Table from './Table';  // Import your Table component

const renderTable = (config) => (
  <Table 
    listEvent={config.listEvent} 
    onRowClick={config.onRowClick} 
    columnMapping={config.columnMapping} 
    idField={config.id} 
    labelField={config.label} 
  />
);

const renderMessage = (config) => (
  <p>{config.message}</p>
);

const CustomModal = ({ isOpen, onRequestClose, title, content }) => {
  if (!content) {
    return null;
  }

  let renderedContent;

  switch (content.type) {
    case 'table':
      renderedContent = renderTable(content);
      break;
    case 'message':
      renderedContent = renderMessage(content);
      break;
    default:
      renderedContent = <div>{content}</div>;
      break;
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Custom Modal"
      ariaHideApp={false}
    >
      <button onClick={onRequestClose}>&times;</button>
      <h2>{title}</h2>
      <div>
        {renderedContent}
      </div>
    </ReactModal>
  );
};

export default CustomModal;
