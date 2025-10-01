import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function CurrentGDPDistribution() {
  const [gdpData, setGdpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieModalVisible, setPieModalVisible] = useState(false);
  const [clickedSectorData, setClickedSectorData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGDPData();
  }, []);
const fetchGDPData = async () => {
  try {
    const response = await fetch('http://172.20.10.2:8000/gdp-shares');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // ✅ parse JSON body
    console.log('Fetched GDP data:', data);

    if (Array.isArray(data) && data.length > 0) {
      setGdpData(data[0]); // ✅ works if your API returns an array
    } else {
      setGdpData(data);    // ✅ fallback if your API returns an object
    }
  } catch (error) {
    console.error('Error fetching GDP data:', error);
  } finally {
    setLoading(false);
  }
};



  const sectors = gdpData ? [
    { name: 'Services', percentage: gdpData.servicesShare, color: '#1E3A8A', icon: 'office-building' },
    { name: 'Agriculture', percentage: gdpData.agricultureShare, color: '#10B981', icon: 'sprout' },
    { name: 'Industry', percentage: gdpData.industryShare, color: '#3B82F6', icon: 'factory' },
    { name: 'Taxes', percentage: gdpData.taxesShare, color: '#F59E0B', icon: 'cash-multiple' },
  ] : [];

  const pieChartData = sectors.map(sector => ({
    name: sector.name,
    population: sector.percentage,
    color: sector.color,
    legendFontColor: 'transparent',
    legendFontSize: 0,
  }));

  const serviceSubSectors = [
    { name: 'Trade', percentage: 19, color: '#1E3A8A', icon: 'cart', description: 'Wholesale and retail trade services' },
    { name: 'Transport', percentage: 14, color: '#1E40AF', icon: 'bus', description: 'Transportation and logistics services' },
    { name: 'Government', percentage: 16, color: '#1E293B', icon: 'account-balance', description: 'Public administration services' },
    { name: 'Financial Services', percentage: 8, color: '#0F172A', icon: 'account-balance-wallet', description: 'Banking and financial institutions' },
    { name: 'Hotels & Restaurants', percentage: 5, color: '#312E81', icon: 'restaurant', description: 'Hospitality and food services' },
    { name: 'Health', percentage: 4, color: '#1E3A8A', icon: 'medical-bag', description: 'Healthcare and medical services' },
    { name: 'Education', percentage: 5, color: '#1E40AF', icon: 'school', description: 'Educational services and institutions' },
    { name: 'ICT', percentage: 6, color: '#0F172A', icon: 'laptop', description: 'Information and communication technology' },
    { name: 'Real Estate', percentage: 7, color: '#312E81', icon: 'home', description: 'Real estate and property services' },
  ];

  const agricultureSubSectors = [
    { name: 'Livestock & Products', percentage: 8, color: '#10B981', icon: 'cow', description: 'Cattle, poultry, and dairy production' },
    { name: 'Forestry', percentage: 6, color: '#059669', icon: 'tree', description: 'Forest products and timber' },
    { name: 'Export Crops', percentage: 3, color: '#047857', icon: 'truck-delivery', description: 'Coffee, tea, and other export crops' },
    { name: 'Food Crops', percentage: 4, color: '#065F46', icon: 'barley', description: 'Staple food crop production' },
    { name: 'Fisheries', percentage: 2, color: '#064E3B', icon: 'fish', description: 'Fish farming and aquaculture' },
    { name: 'Horticulture', percentage: 1, color: '#0F766E', icon: 'flower', description: 'Fruits and vegetable production' },
  ];

  const industrySubSectors = [
    { name: 'Manufacturing', percentage: 16, color: '#3B82F6', icon: 'factory', description: 'Industrial manufacturing' },
    { name: 'Construction', percentage: 13, color: '#2563EB', icon: 'hammer-wrench', description: 'Building and infrastructure' },
    { name: 'Mining', percentage: 8, color: '#1D4ED8', icon: 'pickaxe', description: 'Mineral extraction and processing' },
    { name: 'Food Processing', percentage: 2, color: '#1E40AF', icon: 'food', description: 'Food and beverage processing' },
    { name: 'Textiles', percentage: 3, color: '#1E3A8A', icon: 'tshirt-crew', description: 'Textile and clothing manufacturing' },
    { name: 'Energy', percentage: 5, color: '#172554', icon: 'lightning-bolt', description: 'Power generation and distribution' },
  ];

  const taxesSubSectors = [
    { name: 'VAT', percentage: 35, color: '#F59E0B', icon: 'receipt', description: 'Value Added Tax' },
    { name: 'Income Tax', percentage: 30, color: '#D97706', icon: 'account-cash', description: 'Personal and corporate income tax' },
    { name: 'Import Duties', percentage: 20, color: '#B45309', icon: 'package-variant', description: 'Customs and import taxes' },
    { name: 'Excise Tax', percentage: 15, color: '#92400E', icon: 'bottle-wine', description: 'Excise duties on specific goods' },
  ];

  const getSubSectors = (sectorName) => {
    switch (sectorName) {
      case 'Services': return serviceSubSectors;
      case 'Agriculture': return agricultureSubSectors;
      case 'Industry': return industrySubSectors;
      case 'Taxes': return taxesSubSectors;
      default: return [];
    }
  };

  const handlePieChartClick = (data, index) => {
    const clickedSector = sectors.find(sector => sector.name === data.name);
    if (clickedSector && gdpData) {
      setClickedSectorData({
        ...clickedSector,
        subSectors: getSubSectors(clickedSector.name),
        totalValue: ((clickedSector.percentage / 100) * gdpData.totalGdp).toFixed(0)
      });
      setPieModalVisible(true);
    }
  };

  const CircularProgress = ({ percentage, color, icon, label, value }) => {
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <View style={styles.circularProgressWrapper}>
          <Svg width={size} height={size}>
            <Circle
              stroke="#E5E7EB"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke={color}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.circularProgressCenter}>
            <MaterialCommunityIcons name={icon} size={28} color={color} />
          </View>
        </View>
        <Text style={styles.circularProgressLabel}>{label}</Text>
        <Text style={styles.circularProgressValue}>{percentage}%</Text>
        <Text style={styles.circularProgressAmount}>${value}B</Text>
      </View>
    );
  };

  const CustomPieChart = ({ data }) => {
    return (
      <View style={styles.pieChartContainer}>
        <PieChart
          data={data}
          width={width - 32}
          height={250}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
          hasLegend={false}
          onDataPointClick={(data, index) => {
            handlePieChartClick(data, index);
          }}
        />
        <View style={styles.pieChartCenter}>
          <Text style={styles.pieChartCenterTitle}>GDP</Text>
          <Text style={styles.pieChartCenterValue}>{gdpData?.totalGdp || 0}</Text>
          <Text style={styles.pieChartCenterUnit}>Billion USD</Text>
        </View>
      </View>
    );
  };

  const renderSubSectorCard = ({ item }) => (
    <View style={[styles.subSectorCard, { backgroundColor: item.color }]}>
      <View style={styles.subSectorHeader}>
        <MaterialCommunityIcons name={item.icon} size={28} color="white" />
        <View style={styles.subSectorInfo}>
          <Text style={styles.subSectorName}>{item.name}</Text>
          <Text style={styles.subSectorPercentage}>{item.percentage}%</Text>
        </View>
      </View>
      <Text style={styles.subSectorDescription}>{item.description}</Text>
      <View style={styles.subSectorValue}>
        <Text style={styles.subSectorAmount}>
          ${gdpData ? ((item.percentage / 100) * gdpData.totalGdp).toFixed(0) : 0}B
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading GDP Data...</Text>
      </View>
    );
  }

  if (!gdpData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load GDP data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Current GDP Distribution</Text>
        <TouchableOpacity style={styles.pieChartWrapper}>
          <CustomPieChart data={pieChartData} />
        </TouchableOpacity>

        <View style={styles.legendContainer}>
          {sectors.map((sector, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: sector.color }]} />
              <Text style={styles.legendText}>{sector.name}</Text>
              <Text style={styles.legendPercentage}>{sector.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>Economic Indicators</Text>
        <View style={styles.circularProgressGrid}>
          <CircularProgress
            percentage={gdpData.privateSector}
            color="#8B5CF6"
            icon="domain"
            label="Private Sector"
            value={((gdpData.privateSector / 100) * gdpData.totalGdp).toFixed(0)}
          />
          <CircularProgress
            percentage={gdpData.governmentSector}
            color="#EC4899"
            icon="office-building"
            label="Government"
            value={((gdpData.governmentSector / 100) * gdpData.totalGdp).toFixed(0)}
          />
        </View>
        <View style={styles.circularProgressGrid}>
          <CircularProgress
            percentage={gdpData.exports}
            color="#10B981"
            icon="export"
            label="Exports"
            value={((gdpData.exports / 100) * gdpData.totalGdp).toFixed(0)}
          />
          <CircularProgress
            percentage={gdpData.imports}
            color="#EF4444"
            icon="import"
            label="Imports"
            value={((gdpData.imports / 100) * gdpData.totalGdp).toFixed(0)}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={pieModalVisible}
        onRequestClose={() => setPieModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {clickedSectorData?.name} Sector Details
              </Text>
              <TouchableOpacity 
                onPress={() => setPieModalVisible(false)} 
                style={styles.closeIconButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {clickedSectorData && (
              <View>
                <View style={styles.sectorOverview}>
                  <View style={styles.sectorOverviewHeader}>
                    <MaterialCommunityIcons 
                      name={clickedSectorData.icon} 
                      size={32} 
                      color={clickedSectorData.color} 
                    />
                    <View style={styles.sectorOverviewInfo}>
                      <Text style={styles.sectorOverviewName}>
                        {clickedSectorData.name}
                      </Text>
                      <Text style={styles.sectorOverviewStats}>
                        {clickedSectorData.percentage}% • ${clickedSectorData.totalValue}B
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.searchContainer}>
                  <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search subsectors..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <Text style={styles.subsectorTitle}>Subsector Breakdown</Text>
                <FlatList
                  data={clickedSectorData.subSectors.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  renderItem={renderSubSectorCard}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalList}
                />
              </View>
            )}
            
            <TouchableOpacity 
              onPress={() => setPieModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    marginVertical: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  chartSection: { 
    alignItems: 'center', 
    marginBottom: 24,
  },
  chartTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#374151', 
    marginBottom: 16,
    textAlign: 'center',
  },
  pieChartContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  pieChartWrapper: {
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    paddingLeft: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pieChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -110 }, { translateY: -30 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pieChartCenterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pieChartCenterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  pieChartCenterUnit: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  circularProgressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circularProgressWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  circularProgressCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  circularProgressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  circularProgressAmount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: { 
    width: '90%', 
    maxHeight: '80%',
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1F2937',
    flex: 1,
  },
  closeIconButton: {
    padding: 4,
  },
  sectorOverview: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectorOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorOverviewInfo: {
    marginLeft: 16,
    flex: 1,
  },
  sectorOverviewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectorOverviewStats: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  subsectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  modalList: {
    paddingBottom: 20,
  },
  subSectorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subSectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subSectorInfo: { 
    marginLeft: 16,
    flex: 1,
  },
  subSectorName: { 
    fontSize: 16, 
    color: 'white', 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subSectorPercentage: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: 'rgba(255, 255, 255, 0.8)',
  },
  subSectorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 20,
  },
  subSectorValue: {
    alignItems: 'flex-end',
  },
  subSectorAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: { 
    marginTop: 20, 
    padding: 16, 
    backgroundColor: '#1E3A8A', 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '700',
  },
  footer: { 
    alignItems: 'center', 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB',
    marginTop: 24,
  },
  footerText: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textAlign: 'center', 
    marginBottom: 4,
  },
});