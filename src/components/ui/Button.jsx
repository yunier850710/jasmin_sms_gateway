import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component - Reusable button with various styles for the Jasmin Web Panel
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, success, danger, warning, info)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.outline=false] - Whether the button should have an outline style
 * @param {boolean} [props.fullWidth=false] - Whether the button should take up the full width
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.isLoading=false] - Whether the button is in a loading state
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 */
function Button({
  variant = 'primary',
  size = 'md',
  outline = false,
  fullWidth = false,
  disabled = false,
  isLoading = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseClasses = 'font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  
  const variantClasses = {
    primary: outline 
      ? 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: outline
      ? 'border border-gray-500 text-gray-700 hover:bg-gray-50 focus:ring-gray-400'
      : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-400',
    success: outline
      ? 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: outline
      ? 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'
      : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: outline
      ? 'border border-amber-500 text-amber-600 hover:bg-amber-50 focus:ring-amber-500'
      : 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
    info: outline
      ? 'border border-sky-500 text-sky-600 hover:bg-sky-50 focus:ring-sky-500'
      : 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500',
  };
  
  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed'
    : 'cursor-pointer';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabledClasses,
    widthClass,
    className,
  ].join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  outline: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;