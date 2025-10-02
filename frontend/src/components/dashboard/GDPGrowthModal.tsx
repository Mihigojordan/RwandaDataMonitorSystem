import React, { useState } from 'react';
import { X, TrendingUp, ChevronRight, Save } from 'lucide-react';

// Sub-category definitions
const serviceSubCategories = [
  { name: 'Trade', icon: '🛒', color: 'bg-blue-900' },
  { name: 'Transportation', icon: '🚌', color: 'bg-blue-800' },
  { name: 'Government', icon: '🏛️', color: 'bg-slate-800' },
  { name: 'Financial Services', icon: '💰', color: 'bg-slate-900' },
  { name: 'Hotels and Restaurants', icon: '🏨', color: 'bg-indigo-900' },
  { name: 'Health', icon: '🏥', color: 'bg-blue-900' },
  { name: 'Education', icon: '🎓', color: 'bg-blue-800' },
  { name: 'ICT', icon: '💻', color: 'bg-slate-900' },
  { name: 'Real Estate', icon: '🏠', color: 'bg-indigo-900' },
];

const agricultureSubCategories = [
  { name: 'Livestock Products', icon: '🐄', color: 'bg-emerald-600' },
  { name: 'Forestry', icon: '🌲', color: 'bg-emerald-700' },
  { name: 'Export Crops', icon: '📦', color: 'bg-emerald-800' },
  { name: 'Food Crops', icon: '🌾', color: 'bg-emerald-900' },
  { name: 'Fisheries', icon: '🐟', color: 'bg-teal-900' },
  { name: 'Horticulture', icon: '🌸', color: 'bg-teal-800' },
];

const industrySubCategories = [
  { name: 'Manufacturing', icon: '🏭', color: 'bg-blue-500' },
  { name: 'Construction', icon: '🏗️', color: 'bg-blue-600' },
  { name: 'Mining', icon: '⛏️', color: 'bg-blue-700' },
  { name: 'Food Manufacture', icon: '🍔', color: 'bg-blue-800' },
  { name: 'Textile & Clothing', icon: '👕', color: 'bg-blue-900' },
  { name: 'Chemical and Plastic Products', icon: '⚗️', color: 'bg-blue-950' },
  { name: 'Energy', icon: '⚡', color: 'bg-indigo-950' },
];

const GDPGrowthModal = ({ isOpen, onClose }) => {
  const [totalGdp, setTotalGdp] = useState('');
  const [sectors, setSectors] = useState({
    services: { percentage: '', expanded: false },
    agriculture: { percentage: '', expanded: false },
    industry: { percentage: '', expanded: false },
  });

  const [servicesSubShares, setServicesSubShares] = useState({});
  const [agricultureSubShares, setAgricultureSubShares] = useState({});
  const [industrySubShares, setIndustrySubShares] = useState({});

  const handleSectorClick = (sector) => {
    const percentage = prompt(`Enter percentage for ${sector.toUpperCase()} sector:`);
    if (percentage !== null && !isNaN(percentage)) {
      setSectors(prev => ({
        ...prev,
        [sector]: { ...prev[sector], percentage: parseFloat(percentage), expanded: true }
      }));
    }
  };

  const handleSubCategoryChange = (sector, name, value) => {
    const parsedValue = parseFloat(value) || 0;
    
    if (sector === 'services') {
      setServicesSubShares(prev => ({ ...prev, [name]: parsedValue }));
    } else if (sector === 'agriculture') {
      setAgricultureSubShares(prev => ({ ...prev, [name]: parsedValue }));
    } else if (sector === 'industry') {
      setIndustrySubShares(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleSubmit = async () => {
    const data = {
      totalGdp: parseFloat(totalGdp) || 0,
      servicesShare: sectors.services.percentage || 0,
      industryShare: sectors.industry.percentage || 0,
      agricultureShare: sectors.agriculture.percentage || 0,
      servicesSubShares,
      agricultureSubShares,
      industrySubShares,
    };

    console.log('Submitting GDP Data:', data);
    
    try {
      // Uncomment when service is ready
      // const response = await gdpGrowthService.createRecord(data);
      // console.log('Success:', response);
      alert('GDP data saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save GDP data');
    }
  };

  if (!isOpen) return null;

  const SectorCard = ({ title, sector, color, subCategories }) => {
    const percentage = sectors[sector].percentage;
    const isExpanded = sectors[sector].expanded;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div
          onClick={() => !percentage && handleSectorClick(sector)}
          className={`p-6 cursor-pointer transition-all ${!percentage ? 'hover:bg-gray-50' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {percentage && (
              <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
            )}
          </div>
          
          {percentage ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">Click to change percentage</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Click to set percentage</p>
            </div>
          )}
        </div>

        {isExpanded && percentage && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <ChevronRight className="w-4 h-4 mr-1" />
              Sub-Categories
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {subCategories.map((sub) => (
                <div key={sub.name} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${sub.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {sub.icon}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      {sub.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Enter %"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => handleSubCategoryChange(sector, sub.name, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">GDP Growth By Sector</h2>
                <p className="text-blue-100 text-sm">At Constant Price</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Total GDP Input */}
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total GDP (in millions)
            </label>
            <input
              type="number"
              value={totalGdp}
              onChange={(e) => setTotalGdp(e.target.value)}
              placeholder="Enter total GDP value"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          {/* Sector Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectorCard
              title="Services Sector"
              sector="services"
              color="bg-blue-600"
              subCategories={serviceSubCategories}
            />
            <SectorCard
              title="Agriculture Sector"
              sector="agriculture"
              color="bg-emerald-600"
              subCategories={agricultureSubCategories}
            />
            <SectorCard
              title="Industry Sector"
              sector="industry"
              color="bg-blue-500"
              subCategories={industrySubCategories}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save GDP Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper
export default function SUbmitBUtton() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Open GDP Growth Modal
      </button>

      <GDPGrowthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}