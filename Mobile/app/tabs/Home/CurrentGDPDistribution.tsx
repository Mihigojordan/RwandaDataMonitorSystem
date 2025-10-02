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
      const response = await fetch('http://192.168.1.44:8000/gdp-shares');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched GDP data:', data);

      if (Array.isArray(data) && data.length > 0) {
        setGdpData(data[0]);
      } else {
        setGdpData(data);
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
            icon="bank"
            label="Private Sector"
            value={((gdpData.privateSector / 100) * gdpData.totalGdp).toFixed(0)}
          />
          <CircularProgress
            percentage={gdpData.governmentSector}
            color="#EC4899"
            icon="account-balance"
            label="Government"
            value={((gdpData.governmentSector / 100) * gdpData.totalGdp).toFixed(0)}
          />
        </View>
        <View style={styles.circularProgressGrid}>
          <CircularProgress
            percentage={gdpData.exports}
            color="#10B981"
            icon="bank-transfer-out"
            label="Exports"
            value={((gdpData.exports / 100) * gdpData.totalGdp).toFixed(0)}
          />
          <CircularProgress
            percentage={gdpData.imports}
            color="#EF4444"
            icon="bank-transfer-in"
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
    shadowRadius: 8,
  },
  pieChartCenterTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151',
  },
  pieChartCenterValue: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1E3A8A',
  },
  pieChartCenterUnit: { 
    fontSize: 12, 
    color: '#6B7280',
  },
  legendContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  legendPercentage: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  metricsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  circularProgressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  circularProgressAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  closeIconButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  sectorOverview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectorOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorOverviewInfo: {
    marginLeft: 12,
  },
  sectorOverviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectorOverviewStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#111827',
  },
  subsectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  modalList: {
    paddingBottom: 24,
  },
  subSectorCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subSectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subSectorInfo: {
    marginLeft: 10,
  },
  subSectorName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  subSectorPercentage: {
    color: 'white',
    fontSize: 13,
    opacity: 0.9,
  },
  subSectorDescription: {
    color: 'white',
    opacity: 0.85,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  subSectorValue: {
    alignItems: 'flex-end',
  },
  subSectorAmount: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
