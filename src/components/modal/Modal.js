import React, { useEffect } from 'react';
import MessageModal from './MessageModal';
import TableModal from './TableModal';
import ErrorModal from './ErrorModal'; // Import ErrorModal
import useLogger from '../../hooks/useLogger';

const Modal = ({ isOpen, onRequestClose, content, onRowClick }) => {
  const log = useLogger('Modal');

  useEffect(() => {
    if (isOpen) {
      log.debug('Modal opened', { 
        contentType: content?.type,
        hasContent: !!content,
        hasRowClickHandler: !!onRowClick
      });
    } else {
      log.debug('Modal closed');
    }
  }, [isOpen, content, onRowClick, log]);

  if (!isOpen || !content) {
    return null;
  }

  const renderModalContent = () => {
    switch (content.type) {
      case 'message':
        log.debug('Rendering MessageModal', { title: content.title });
        return (
          <MessageModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={content.title}
            message={content.message}
          />
        );

      case 'table':
        log.debug('Rendering TableModal', { 
          title: content.title,
          hasData: !!content.data,
          columns: content.columns?.length
        });
        return (
          <TableModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={content.title}
            content={content}
            onRowClick={onRowClick}
          />
        );

      case 'error':
        log.warn('Rendering ErrorModal', { 
          errorMessage: content.message 
        });
        return (
          <ErrorModal
            open={isOpen}
            onClose={onRequestClose}
            errorMessage={content.message}
          />
        );

      default:
        log.error('Unknown modal type', { type: content.type });
        return null;
    }
  };

  return renderModalContent();
};

export default Modal;
