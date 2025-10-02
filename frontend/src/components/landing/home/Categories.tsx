// src/components/FeaturedSurveys.tsx
import React, { useState } from 'react';
import { ArrowRight, FileText, Users, BarChart } from 'lucide-react';

interface Survey {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  description: string;
}

const FeaturedSurveys: React.FC = () => {
  const [hoveredSurvey, setHoveredSurvey] = useState<number | null>(null);

  const surveys: Survey[] = [
    {
      icon: Users,
      name: 'Labour Force Survey 2025',
      description: 'Comprehensive data on employment, unemployment, and labor market trends.',
    },
    {
      icon: FileText,
      name: 'Integrated Household Living Conditions Survey (EICV7)',
      description: 'Insights into household welfare, poverty, and living conditions.',
    },
    {
      icon: BarChart,
      name: 'FinScope Survey 2024',
      description: 'Financial inclusion data with 96% coverage in Rwanda.',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,92,171,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,92,171,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg shadow-primary-200">
            <FileText size={16} className="animate-pulse" />
            <span>Featured Surveys</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
            Major Surveys
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Explore key surveys providing critical insights into Rwanda’s socio-economic landscape.
          </p>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {surveys.map((survey, index) => (
            <div
              key={survey.name}
              className="group relative transform transition-all duration-500 ease-out hover:scale-105"
              onMouseEnter={() => setHoveredSurvey(index)}
              onMouseLeave={() => setHoveredSurvey(null)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/50 hover:-translate-y-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 rounded-full transform translate-x-6 -translate-y-6 opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-200 rounded-full transform -translate-x-4 translate-y-4 opacity-0 group-hover:opacity-30 transition-all duration-700"></div>
                <div className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div className="relative p-4 bg-primary-50 rounded-2xl group-hover:bg-primary-100 transition-all duration-300 group-hover:scale-110">
                      <survey.icon
                        size={36}
                        className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 bg-primary-500 rounded-2xl opacity-0 group-hover:opacity-20 animate-ping"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-900 transition-colors duration-300">
                      {survey.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 group-hover:text-gray-600 transition-colors duration-300">
                      {survey.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>View Survey</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSurveys;