import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed';
  
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500' 
    : 'border-gray-200 hover:border-gray-300';
  
  const classes = `${baseClasses} ${stateClasses} ${className}`;
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={classes}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;