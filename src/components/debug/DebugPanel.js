import React from 'react';
import VariableTable from './VariableTable';
import { useModalContext } from '../../context/ModalContext';

import { useEventTypeContext } from '../../context/EventTypeContext';

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

const EventTypesPanel = () => {
  const { getEventTypes } = useEventTypeContext();
  const eventTypes = getEventTypes();
  
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">Event Types</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-1 pr-2 font-medium text-left">Event Type</th>
            <th className="py-1 pr-2 font-medium text-left">Params</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(eventTypes).map((eventType) => {
            const eventTypeData = getEventTypes(eventType);
            return (
              <tr key={eventType} className="border-b">
                <td className="py-1 pr-2 font-medium">{eventType}</td>
                <td className="py-1">{JSON.stringify(eventTypeData.params)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const DebugPanel = () => {
  const { modalIsOpen, modalConfig } = useModalContext();

  const modalInfo = {
    'Is Modal Open': modalIsOpen,
    'Modal Title': modalConfig.title,
    'Modal Config': JSON.stringify(modalConfig),
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <VariableTable />
        </div>
        <div className="flex-1 min-w-[300px]">
          <DebugTable title="Modal Info" data={modalInfo} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <EventTypesPanel />
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
