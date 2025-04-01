import createLogger from '../logger';

const log = createLogger('DML.buildSql');

export const buildSqlStatement = (requestBody) => {
  log('Build pseudo-SQL statement:');

  const { method, table, where, data } = requestBody;

  switch (method) {
    case 'INSERT':
      return `INSERT INTO ${table} 
        (${data.map(f => f.field).join(', ')})
      VALUES 
        (${data.map(f => `'${f.value}'`).join(', ')})`;

    case 'UPDATE':
      return `UPDATE ${table}
      SET ${data.map(f => `${f.field} = '${f.value}'`).join(', ')}
      WHERE ${where.map(f => `${f.field} = '${f.value}'`).join(' AND ')}`;

    case 'DELETE':
      return `DELETE FROM ${table}
      WHERE ${where.map(f => `${f.field} = '${f.value}'`).join(' AND ')}`;

    default:
      return 'Invalid method';
  }
};
