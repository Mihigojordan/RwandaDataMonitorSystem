import { useState } from 'react';

export const useGDPData = () => {
  const [sectors, setSectors] = useState([
    { name: 'Services', percentage: 46, color: '#1E3A8A', icon: 'office-building' },
    { name: 'Agriculture', percentage: 24, color: '#10B981', icon: 'sprout' },
    { name: 'Industry', percentage: 23, color: '#3B82F6', icon: 'factory' },
  ]);

  const [totalGDP, setTotalGDP] = useState(5255);
  const [selectedSector, setSelectedSector] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pieModalVisible, setPieModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [hoveredSector, setHoveredSector] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [barDataModalVisible, setBarDataModalVisible] = useState(false);
  const [selectedBarData, setSelectedBarData] = useState(null);
  const [clickedSectorData, setClickedSectorData] = useState(null);

  const barChartData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        data: [2100, 2200, 2300, 2400, 2418],
        color: () => '#1E3A8A',
        strokeWidth: 3,
        name: 'Services',
      },
      {
        data: [1200, 1220, 1240, 1250, 1261],
        color: () => '#10B981',
        strokeWidth: 3,
        name: 'Agriculture',
      },
      {
        data: [1100, 1150, 1180, 1200, 1209],
        color: () => '#3B82F6',
        strokeWidth: 3,
        name: 'Industry',
      },
    ],
  };

  const pieChartData = sectors.map(sector => ({
    name: sector.name,
    population: sector.percentage,
    color: sector.color,
    legendFontColor: 'transparent',
    legendFontSize: 0,
  }));

  const gdpTimeSeries = {
    2020: 4700,
    2021: 4890,
    2022: 5060,
    2023: 5210,
    2024: 5255,
  };

  const serviceSubSectors = [
    { name: 'Trade', percentage: 19, color: '#1E3A8A', icon: 'cart', description: 'Wholesale and retail trade services' },
    { name: 'Transport', percentage: 14, color: '#1E40AF', icon: 'bus', description: 'Transportation and logistics services' },
    { name: 'Government', percentage: 16, color: '#1E293B', icon: 'account-balance', description: 'Public administration services' },
    { name: 'Financial Services', percentage: 8, color: '#0F172A', icon: 'account-balance-wallet', description: 'Banking and financial institutions' },
    { name: 'Hotels & Restaurants', percentage: 5, color: '#312E81', icon: 'restaurant', description: 'Hospitality and food services' },
    { name: 'Health', percentage: 4, color: '#1E3A8A', icon: 'medical-services', description: 'Healthcare and medical services' },
    { name: 'Education', percentage: 5, color: '#1E40AF', icon: 'school', description: 'Educational services and institutions' },
    { name: 'ICT', percentage: 6, color: '#0F172A', icon: 'computer', description: 'Information and communication technology' },
    { name: 'Real Estate', percentage: 7, color: '#312E81', icon: 'home', description: 'Real estate and property services' },
  ];

  const agricultureSubSectors = [
    { name: 'Livestock & Products', percentage: 8, color: '#10B981', icon: 'cow', description: 'Cattle, poultry, and dairy production' },
    { name: 'Forestry', percentage: 6, color: '#059669', icon: 'tree', description: 'Forest products and timber' },
    { name: 'Export Crops', percentage: 3, color: '#047857', icon: 'local-shipping', description: 'Coffee, tea, and other export crops' },
    { name: 'Food Crops', percentage: 4, color: '#065F46', icon: 'grain', description: 'Staple food crop production' },
    { name: 'Fisheries', percentage: 2, color: '#064E3B', icon: 'fishing', description: 'Fish farming and aquaculture' },
    { name: 'Horticulture', percentage: 1, color: '#0F766E', icon: 'local-florist', description: 'Fruits and vegetable production' },
  ];

  const industrySubSectors = [
    { name: 'Manufacturing', percentage: 16, color: '#3B82F6', icon: 'factory', description: 'Industrial manufacturing' },
    { name: 'Construction', percentage: 13, color: '#2563EB', icon: 'construction', description: 'Building and infrastructure' },
    { name: 'Mining', percentage: 8, color: '#1D4ED8', icon: 'pickaxe', description: 'Mineral extraction and processing' },
    { name: 'Food Processing', percentage: 2, color: '#1E40AF', icon: 'fastfood', description: 'Food and beverage processing' },
    { name: 'Textiles', percentage: 3, color: '#1E3A8A', icon: 'tshirt-crew', description: 'Textile and clothing manufacturing' },
    { name: 'Energy', percentage: 5, color: '#172554', icon: 'lightning-bolt', description: 'Power generation and distribution' },
  ];

  const getSubSectors = (sectorName) => {
    switch (sectorName) {
      case 'Services': return serviceSubSectors;
      case 'Agriculture': return agricultureSubSectors;
      case 'Industry': return industrySubSectors;
      default: return [];
    }
  };

  return {
    sectors,
    setSectors,
    totalGDP,
    setTotalGDP,
    selectedSector,
    setSelectedSector,
    modalVisible,
    setModalVisible,
    pieModalVisible,
    setPieModalVisible,
    selectedYear,
    setSelectedYear,
    hoveredSector,
    setHoveredSector,
    searchQuery,
    setSearchQuery,
    barDataModalVisible,
    setBarDataModalVisible,
    selectedBarData,
    setSelectedBarData,
    clickedSectorData,
    setClickedSectorData,
    barChartData,
    pieChartData,
    gdpTimeSeries,
    getSubSectors,
  };
};