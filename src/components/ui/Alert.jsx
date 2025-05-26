import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Alert Component - Displays alert/notification messages with different styles
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='info'] - Alert type (success, error, warning, info)
 * @param {string} props.message - Alert message content
 * @param {boolean} [props.dismissible=false] - Whether the alert can be dismissed
 * @param {number} [props.autoClose=0] - Auto-close delay in milliseconds (0 = no auto-close)
 * @param {Function} [props.onClose] - Function to call when alert is closed
 * @param {string} [props.className=''] - Additional CSS classes
 */
function Alert({
  type = 'info',
  message,
  dismissible = false,
  autoClose = 0,
  onClose,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout;
    if (autoClose > 0) {
      timeout = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoClose);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [autoClose, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const alertConfig = {
    success: {
      icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-400',
    },
    error: {
      icon: <XCircleIcon className="w-5 h-5 text-red-400" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-400',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-400',
    },
    info: {
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-400" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-400',
    },
  };

  const { icon, bgColor, textColor, borderColor } = alertConfig[type];

  return (
    <div className={`${bgColor} ${textColor} border-l-4 ${borderColor} p-4 rounded-md shadow-sm mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1 pt-0.5">
          <p className="text-sm leading-5">{message}</p>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={handleDismiss}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${borderColor}`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  dismissible: PropTypes.bool,
  autoClose: PropTypes.number,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;