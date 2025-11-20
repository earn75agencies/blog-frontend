import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const typeClasses = {
    success: 'bg-teal-50 text-teal-800 border-teal-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: <FiCheckCircle className="text-teal-600" />,
    error: <FiAlertCircle className="text-red-600" />,
    warning: <FiAlertCircle className="text-yellow-600" />,
    info: <FiInfo className="text-blue-600" />,
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${typeClasses[type]} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-opacity-20 rounded transition-colors"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default Alert;

