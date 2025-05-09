import React from 'react';
import MessageModal from './MessageModal';
import TableModal from './TableModal';
import ErrorModal from './ErrorModal';
import createLogger from '../../../utils/logger';

const log = createLogger('Modal');

const Modal = ({ isOpen, onRequestClose, content, onRowClick }) => {
  log.info('Rendering Modal with content:', { isOpen, content });

  if (!isOpen || !content) {
    return null;
  }

  switch (content.type) {
    case 'message':
      return (
        <MessageModal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          title={content.title}
          message={content.message}
        />
      );
    case 'table':
      return (
        <TableModal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          title={content.title}
          data={content.data}
          onRowClick={onRowClick}
        />
      );
    case 'error':
      return (
        <ErrorModal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          title={content.title}
          message={content.message}
        />
      );
    default:
      log.error('Unknown modal type:', content.type);
      return null;
  }
};

export default Modal;
