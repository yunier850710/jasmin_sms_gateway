import React from 'react';
import { HiArrowSmUp, HiArrowSmDown } from 'react-icons/hi';

const StatCard = ({ 
  title, 
  value, 
  activeValue = null, 
  icon, 
  colorClass = 'bg-indigo-500', 
  trend = null,
  trendValue = '0%'
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClass}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">
                  {value}
                </div>
                {activeValue !== null && (
                  <div className="text-sm text-gray-500">
                    {activeValue} active
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {trend && (
        <div className={`bg-gray-50 px-5 py-2 border-t border-gray-200 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <div className="flex items-center text-sm font-medium">
            {trend === 'up' ? (
              <HiArrowSmUp className="h-5 w-5 mr-1 flex-shrink-0" />
            ) : (
              <HiArrowSmDown className="h-5 w-5 mr-1 flex-shrink-0" />
            )}
            <span>{trendValue} from previous period</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;