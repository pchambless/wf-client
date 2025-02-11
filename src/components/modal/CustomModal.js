import React from 'react';
import MdlMessage from './MessageModal';
import MdlTable from './TableModal';

const CustomModal = ({ isOpen, onRequestClose, content, onRowClick }) => {
  console.log('CustomModal rendering', { isOpen, contentType: content.type });

  if (!isOpen || !content) {
    console.log('CustomModal not rendering: modal is closed or content is missing');
    return null;
  }

  if (content.type === 'message') {
    console.log('Rendering MdlMessage');
    return (
      <MdlMessage
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={content.title}
        message={content.message}
      />
    );
  } else if (content.type === 'table') {
    console.log('Rendering MdlTable');
    return (
      <MdlTable
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={content.title}
        content={content}
        onRowClick={onRowClick}
      />
    );
  }

  console.log('CustomModal: Unrecognized content type', content.type);
  return null;
};

export default CustomModal;
