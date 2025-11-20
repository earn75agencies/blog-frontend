import React from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  helperText,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </div>
        {(label || helperText || error) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-gray-700">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </label>
    </div>
  );
};

export default Switch;

