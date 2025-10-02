// src/components/NewsSection.tsx
import React from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';

interface NewsItem {
  title: string;
  date: string;
  description: string;
}

const NewsSection: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      title: 'NISR Releases Q2 2025 GDP Report',
      date: 'June 30, 2025',
      description: 'The latest GDP report highlights strong economic growth in Q2 2025.',
    },
    {
      title: 'New Tender for Data Collection Services',
      date: 'July 15, 2025',
      description: 'NISR invites bids for data collection services for upcoming surveys.',
    },
    {
      title: 'Upcoming Event: Data Revolution Workshop',
      date: 'August 10, 2025',
      description: 'Join us to explore innovations in data collection and analysis.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg shadow-primary-200">
            <Newspaper size={16} className="animate-pulse" />
            <span>News & Updates</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest News & Announcements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest updates from the National Institute of Statistics of Rwanda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl shadow-lg border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <Newspaper size={24} className="text-primary-600" />
                <h3 className="font-semibold text-lg text-gray-900">{news.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{news.date}</p>
              <p className="text-gray-700 mb-4 leading-relaxed">{news.description}</p>
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

export default NewsSection;