// src/components/AdvanceReleaseCalendar.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

interface Release {
  title: string;
  date: string;
}

const AdvanceReleaseCalendar: React.FC = () => {
  const releases: Release[] = [
    { title: 'Seasonal Agricultural Survey', date: 'November 2025' },
    { title: 'Index of Industrial Production', date: 'December 2025' },
    { title: 'Labour Force Survey', date: 'January 2026' },
    { title: 'CPI Survey', date: 'February 2026' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg shadow-primary-200">
            <Calendar size={16} className="animate-pulse" />
            <span>Upcoming Releases</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advance Release Calendar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan ahead with our schedule of upcoming statistical releases.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-primary-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {releases.map((release, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-all duration-300"
              >
                <Calendar size={24} className="text-primary-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{release.title}</h4>
                  <p className="text-sm text-gray-600">{release.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvanceReleaseCalendar;