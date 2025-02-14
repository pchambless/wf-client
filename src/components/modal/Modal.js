import React from 'react';
import MessageModal from './MessageModal';
import TableModal from './TableModal';
import useLogger from '../../hooks/useLogger';

const Modal = ({ isOpen, onRequestClose, content, onRowClick }) => {
  const log = useLogger('Modal');
  log('Rendering Modal', { isOpen, contentType: content.type });

  if (!isOpen || !content) {
    log('Not rendering: modal is closed or content is missing');
    return null;
  }

  if (content.type === 'message') {
    log('Rendering MessageModal');
    return (
      <MessageModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={content.title}
        message={content.message}
      />
    );
  } else if (content.type === 'table') {
    log('Rendering TableModal');
    return (
      <TableModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={content.title}
        content={content}
        onRowClick={onRowClick}
      />
    );
  }

  log('Unrecognized content type', content.type);
  return null;
};

export default Modal;


