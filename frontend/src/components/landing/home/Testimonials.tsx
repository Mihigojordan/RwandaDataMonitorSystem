// src/components/LatestReleases.tsx
import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

interface Release {
  title: string;
  date: string;
  description: string;
}

const LatestReleases: React.FC = () => {
  const releases: Release[] = [
    {
      title: 'Producer Price Index (PPI) – August 2025',
      date: 'August 2025',
      description: 'Latest data on producer prices for goods and services.',
    },
    {
      title: 'GDP – National Accounts (Fiscal Year 2024/25)',
      date: 'July 2025',
      description: 'Annual economic growth and sectoral contributions.',
    },
    {
      title: 'GDP – National Accounts (Q2 2025)',
      date: 'June 2025',
      description: 'Quarterly GDP estimates and economic indicators.',
    },
    {
      title: 'Rwanda Food Balance Sheets 2023-24',
      date: 'May 2025',
      description: 'Food supply and demand statistics for Rwanda.',
    },
    {
      title: 'Formal External Trade in Goods – Q2, 2025',
      date: 'June 2025',
      description: 'Trade statistics for imports and exports.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg shadow-primary-200">
            <FileText size={16} className="animate-pulse" />
            <span>Latest Releases</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recent Statistical Publications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest statistical releases from NISR.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map((release, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl shadow-lg border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} className="text-primary-600" />
                <h3 className="font-semibold text-lg text-gray-900">{release.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{release.date}</p>
              <p className="text-gray-700 mb-4 leading-relaxed">{release.description}</p>
              <a
                href="#"
                className="flex items-center gap-2 text-primary-600 font-medium text-sm hover:text-primary-800 transition-colors"
              >
                <span>Read More</span>
                <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestReleases;