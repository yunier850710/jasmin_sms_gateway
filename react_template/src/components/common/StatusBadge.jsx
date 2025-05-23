import React from 'react';
import { STATUS } from '../../utils/constants';

const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case STATUS.CONNECTED:
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          label: 'Connected'
        };
      case STATUS.DISCONNECTED:
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          label: 'Disconnected'
        };
      case STATUS.BINDING:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          label: 'Binding'
        };
      case STATUS.ERROR:
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          label: 'Error'
        };
      case STATUS.WARNING:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          label: 'Warning'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          label: status || 'Unknown'
        };
    }
  };

  const { bgColor, textColor, borderColor, label } = getStatusConfig();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${borderColor} ${bgColor} ${textColor} ${sizeClasses[size]} font-medium ${className}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${status?.toLowerCase() === STATUS.CONNECTED ? 'bg-green-500' : status?.toLowerCase() === STATUS.DISCONNECTED ? 'bg-red-500' : 'bg-gray-500'}`}></span>
      {label}
    </span>
  );
};

export default StatusBadge;