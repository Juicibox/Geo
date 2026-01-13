import React from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-blue-500 text-4xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
