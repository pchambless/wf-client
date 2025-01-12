import React from 'react';
import VariableTable from './VariableTable';
import DebugLog from './DebugLog';
import { usePageContext } from '../../context/PageContext';
import { useDebug } from '../../context/DebugContext';
import useModalManager from '../../modal/modalManager';

const DebugTable = ({ title, data }) => {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <table className="w-full border-collapse">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b">
              <td className="py-1 pr-2 font-medium">{key}:</td>
              <td className="py-1">{JSON.stringify(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DebugPanel = () => {
  const { currentPage } = usePageContext();
  const { logs } = useDebug();
  const { isModalOpen, modalTitle, modalConfig } = useModalManager();

  const pageInfo = {
    'Current Page': currentPage,
  };

    const envInfo = {
    'Node Env': process.env.NODE_ENV,
    'React Version': React.version,
  };

  const modalInfo = {
    'Is Modal Open': isModalOpen,
    'Modal Title': modalTitle,
    'Modal Config': modalConfig,
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <VariableTable />
        </div>
        <div className="flex-1 min-w-[300px]">
          <DebugTable title="Page Info" data={pageInfo} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <DebugTable title="Environment" data={envInfo} />
          <DebugTable title="Modal Info" data={modalInfo} />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <h3 className="mb-2 text-lg font-semibold">Debug Log</h3>
        <DebugLog logs={logs} />
      </div>
    </div>
  );
};

export default DebugPanel;
