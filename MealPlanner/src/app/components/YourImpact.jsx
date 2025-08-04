import React from 'react';
import { TrendingDown, Leaf, DollarSign, Award } from 'lucide-react';

const stats = [
  {
    title: 'Food Saved',
    value: '12.5 kg',
    change: '+15% this month',
    icon: <Leaf size={28} className="text-green-600" />,
    changeColor: 'text-green-600',
  },
  {
    title: 'Money Saved',
    value: '$156',
    change: '+22% this month',
    icon: <DollarSign size={28} className="text-blue-600" />,
    changeColor: 'text-blue-600',
  },
  {
    title: 'Waste Reduction',
    value: '85%',
    change: '+8% this month',
    icon: <TrendingDown size={28} className="text-purple-600" />,
    changeColor: 'text-purple-600',
  },
  {
    title: 'Eco Score',
    value: '94/100',
    change: '+5% this month',
    icon: <Award size={28} className="text-orange-600" />,
    changeColor: 'text-orange-600',
  },
];

const YourImpact = () => {
  return (
    <div className="py-12 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Impact
      </h2>
      <p className="text-gray-600 mb-8">
        Track your progress in reducing food waste
      </p>

      <div className="flex gap-8 justify-between">
        {stats.map((stat, index) => (
          <div key={index} className="w-full">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-8">
                <div className="text-left flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs ${stat.changeColor}`}>
                    {stat.change}
                  </p>
                </div>
                <div>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourImpact;
