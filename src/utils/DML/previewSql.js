import createLogger from '../logger';
import { showConfirmation } from '../../stores/modalStore';

const log = createLogger('DML.previewSql');

export const previewSql = (sqlStatement, requestBody) => {
  try {
    // Format SQL for better readability
    const formattedSql = sqlStatement
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\s+/g, ' ')
      .trim();

    // Log the preview
    log.info('SQL Preview:', {
      sql: formattedSql,
      method: requestBody.method,
      table: requestBody.table,
      params: requestBody.params
    });

    // Show modal in development
    if (process.env.NODE_ENV === 'development') {
      showConfirmation(
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {formattedSql}
        </pre>,
        null,
        null,
        {
          title: `${requestBody.method} SQL Preview`,
          cancelText: 'Close',
          showConfirm: false,
          maxWidth: 'md'
        }
      );
    }

  } catch (error) {
    log.error('Failed to preview SQL:', error);
  }
};
