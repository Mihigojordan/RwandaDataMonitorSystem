// src/components/KeyFigures.tsx
import React, { useState, useEffect } from 'react';
import { Building, DollarSign, Users, BarChart } from 'lucide-react';

interface Stat {
  key: string;
  number: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function KeyFigures() {
  const [countUp, setCountUp] = useState({
    gdp: 0,
    cpi: 0,
    employment: 0,
    population: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountUp({
        gdp: 5798,
        cpi: 188.3,
        employment: 53.8,
        population: 14104969,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: Stat[] = [
    {
      key: 'gdp',
      number: `${countUp.gdp}B RWF`,
      label: 'GDP (Q2 2025)',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-primary-600',
    },
    {
      key: 'cpi',
      number: `${countUp.cpi}`,
      label: 'CPI (August 2025)',
      icon: <BarChart className="w-6 h-6" />,
      color: 'text-primary-600',
    },
    {
      key: 'employment',
      number: `${countUp.employment}%`,
      label: 'Employment-to-Population (Q2 2025)',
      icon: <Users className="w-6 h-6" />,
      color: 'text-primary-600',
    },
    {
      key: 'population',
      number: `${Math.floor(countUp.population / 1000000)}M`,
      label: 'Resident Population (2025)',
      icon: <Building className="w-6 h-6" />,
      color: 'text-primary-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
            <BarChart className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Key Statistics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At-a-glance insights into Rwanda’s economic and social indicators
          </p>
        </div>

        {/* Stats Grid */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-primary-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300 group-hover:scale-110">
                  <div className={`${stat.color} transition-colors duration-300`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}