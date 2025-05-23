import React from 'react';

const Card = ({ 
  title, 
  children, 
  className = '', 
  actions = null,
  headerClassName = '',
  bodyClassName = '',
  footerContent = null 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;