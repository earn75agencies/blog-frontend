import React from 'react';

interface AnalyticsChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  type?: 'bar' | 'line' | 'pie' | 'area';
  title?: string;
  className?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type = 'bar',
  title,
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      
      {type === 'bar' && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 truncate">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full ${item.color || 'bg-primary-600'} transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-16 text-sm font-medium text-right">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="h-64 flex items-end gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className={`w-full ${item.color || 'bg-primary-600'} rounded-t transition-all duration-500`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <div className="text-xs text-gray-500 text-center truncate w-full">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'pie' && (
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {data.map((item, index) => {
              const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
              const offset = data
                .slice(0, index)
                .reduce((sum, d) => sum + (d.value / data.reduce((s, dt) => s + dt.value, 0)) * 360, 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${offset}deg, ${item.color || '#3B82F6'} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                  }}
                />
              );
            })}
          </div>
          <div className="ml-8 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded ${item.color || 'bg-primary-600'}`}
                />
                <span className="text-sm">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'area' && (
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 200 ${data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 400;
                  const y = 200 - (item.value / maxValue) * 200;
                  return `L ${x} ${y}`;
                })
                .join(' ')} L 400 200 Z`}
              fill="url(#areaGradient)"
            />
            <path
              d={`M 0 200 ${data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 400;
                  const y = 200 - (item.value / maxValue) * 200;
                  return `L ${x} ${y}`;
                })
                .join(' ')}`}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;

