import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center h-5">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-focus:ring-2 peer-focus:ring-primary-500 transition-colors flex items-center justify-center">
          {props.checked && <FiCheck className="text-white text-sm" />}
        </div>
      </div>
      {(label || helperText || error) && (
        <div className="flex-1">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;

