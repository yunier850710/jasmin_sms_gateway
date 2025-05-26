import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component - Reusable card container with header, body, and footer sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.title] - Card title
 * @param {React.ReactNode} [props.subtitle] - Card subtitle
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {string} [props.className=''] - Additional CSS classes for the card
 * @param {string} [props.headerClassName=''] - Additional CSS classes for the header
 * @param {string} [props.bodyClassName=''] - Additional CSS classes for the body
 * @param {string} [props.footerClassName=''] - Additional CSS classes for the footer
 * @param {string} [props.variant='default'] - Card variant (default, compact, borderless, elevated)
 */
function Card({
  title,
  subtitle,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  variant = 'default',
}) {
  // Base classes for different card variants
  const variantClasses = {
    default: 'border border-gray-200 rounded-lg shadow-sm',
    compact: 'border border-gray-200 rounded-lg',
    borderless: 'shadow-sm rounded-lg',
    elevated: 'border border-gray-100 rounded-lg shadow-md',
  };

  // Generate card classes
  const cardClasses = `bg-white overflow-hidden ${variantClasses[variant]} ${className}`;
  
  // Generate header classes
  const headerClasses = `px-4 py-5 sm:px-6 border-b border-gray-200 ${headerClassName}`;
  
  // Generate body classes
  const bodyClasses = `px-4 py-5 sm:p-6 ${bodyClassName}`;
  
  // Generate footer classes
  const footerClasses = `px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 ${footerClassName}`;

  return (
    <div className={cardClasses}>
      {/* Card header - only render if title or subtitle is provided */}
      {(title || subtitle) && (
        <div className={headerClasses}>
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Card body */}
      <div className={bodyClasses}>{children}</div>

      {/* Card footer - only render if footer content is provided */}
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'borderless', 'elevated']),
};

export default Card;