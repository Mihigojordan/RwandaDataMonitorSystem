import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function GDPStructure() {
  const { t } = useTranslation();
  const [sectors, setSectors] = useState([
    { name: 'Services', percentage: 46, color: '#1E3A8A', icon: 'office-building' }, // Dark blue
    { name: 'Agriculture', percentage: 24, color: '#10B981', icon: 'sprout' }, // Green
    { name: 'Industry', percentage: 23, color: '#3B82F6', icon: 'factory' }, // Light blue
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

  // Enhanced bar chart data with more periods and better structure
  const barChartData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        data: [2100, 2200, 2300, 2400, 2418],
        color: () => '#1E3A8A', // Dark blue for Services
        strokeWidth: 3,
        name: 'Services',
      },
      {
        data: [1200, 1220, 1240, 1250, 1261],
        color: () => '#10B981', // Green for Agriculture
        strokeWidth: 3,
        name: 'Agriculture',
      },
      {
        data: [1100, 1150, 1180, 1200, 1209],
        color: () => '#3B82F6', // Light blue for Industry
        strokeWidth: 3,
        name: 'Industry',
      },
    ],
  };

  const pieChartData = sectors.map(sector => ({
    name: sector.name,
    population: sector.percentage,
    color: sector.color,
    legendFontColor: 'transparent', // Hide legends
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

  const filteredSubSectors = getSubSectors(selectedSector).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          ${((item.percentage / 100) * totalGDP).toFixed(0)}B
        </Text>
      </View>
    </View>
  );

  const handlePieChartClick = (data, index) => {
    const clickedSector = sectors.find(sector => sector.name === data.name);
    if (clickedSector) {
      setClickedSectorData({
        ...clickedSector,
        subSectors: getSubSectors(clickedSector.name),
        totalValue: ((clickedSector.percentage / 100) * totalGDP).toFixed(0)
      });
      setPieModalVisible(true);
    }
  };

  const CustomPieChart = ({ data, onSectorPress }) => {
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
          <Text style={styles.pieChartCenterValue}>{totalGDP}</Text>
          <Text style={styles.pieChartCenterUnit}>Billion USD</Text>
        </View>
      </View>
    );
  };

  const CustomBarChart = ({ data, onBarPress }) => {
    return (
      <View style={styles.barChartContainer}>
        <BarChart
          data={data}
          width={width - 32}
          height={280}
          yAxisLabel="$"
          yAxisSuffix="B"
          chartConfig={{
            backgroundColor: '#F8FAFC',
            backgroundGradientFrom: '#F1F5F9',
            backgroundGradientTo: '#E2E8F0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
            style: { borderRadius: 16 },
            propsForLabels: { fontSize: 11, fontWeight: '600' },
            propsForBackgroundLines: { strokeWidth: 1, stroke: '#CBD5E1' },
          }}
          style={styles.barChart}
          showValuesOnTopOfBars
          fromZero
          onDataPointClick={({ value, dataset, getColor, index }) => {
            onBarPress({
              year: data.labels[index],
              value,
              sector: dataset.name,
              color: getColor(1)
            });
          }}
        />
        <View style={styles.barChartLegend}>
          {data.datasets.map((dataset, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
              <Text style={styles.legendText}>{dataset.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Rwanda GDP Structure Analysis</Text>
        <View style={styles.totalGDPContainer}>
          <Text style={styles.totalLabel}>Total GDP</Text>
          <Text style={styles.totalValue}>{totalGDP.toLocaleString()}</Text>
          <Text style={styles.totalUnit}>Billion USD</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>GDP Growth by Sector (5-Year Trend)</Text>
        <CustomBarChart
          data={barChartData}
          onBarPress={(data) => {
            setSelectedBarData(data);
            setBarDataModalVisible(true);
          }}
        />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Current GDP Distribution</Text>
        <TouchableOpacity 
          style={styles.pieChartWrapper}
        >
          <CustomPieChart 
            data={pieChartData} 
            onSectorPress={(sector) => {
              setSelectedSector(sector.name);
              setHoveredSector(sector);
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sectorsContainer}>
        <Text style={styles.sectorTitle}>Sector Contributions</Text>
        {sectors.map((sector) => (
          <TouchableOpacity 
            key={sector.name} 
            onPress={() => { setSelectedSector(sector.name); setModalVisible(true); }}
            onPressIn={() => setHoveredSector(sector)}
            onPressOut={() => setHoveredSector(null)}
          >
            <View style={styles.sectorCard}>
              <View style={styles.sectorInfo}>
                <MaterialCommunityIcons
                  name={sector.icon}
                  size={24}
                  color={sector.color}
                  style={styles.sectorIcon}
                />
                <Text style={styles.sectorName}>{sector.name}</Text>
              </View>
              <View style={styles.sectorValues}>
                <Text style={[styles.percentage, { color: sector.color }]}>
                  {sector.percentage.toFixed(1)}%
                </Text>
                <Text style={styles.sectorAmount}>
                  ${((sector.percentage / 100) * totalGDP).toFixed(0)}B
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${sector.percentage}%`, backgroundColor: sector.color }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSector} Sector Breakdown
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={styles.closeIconButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
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

            <FlatList
              data={filteredSubSectors}
              renderItem={renderSubSectorCard}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
            />
            
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Enhanced Pie Chart Click Modal */}
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
                {/* Sector Overview */}
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

                {/* Search for subsectors */}
                <View style={styles.searchContainer}>
                  <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search subsectors..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Subsectors List */}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={barDataModalVisible}
        onRequestClose={() => setBarDataModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sector Data for {selectedBarData?.year}</Text>
            {selectedBarData && (
              <View style={styles.sectorDataContainer}>
                <Text style={styles.sectorDataText}>Sector: {selectedBarData.sector}</Text>
                <Text style={styles.sectorDataText}>Year: {selectedBarData.year}</Text>
                <Text style={styles.sectorDataText}>Value: ${selectedBarData.value}B</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setBarDataModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Data as of Q4 2024 • Rwanda Development Board</Text>
        <Text style={styles.footerText}>National Institute of Statistics Rwanda</Text>
      </View>
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
  headerSection: { 
    alignItems: 'center', 
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mainTitle: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 32,
  },
  totalGDPContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginLeft: 8 },
  totalUnit: { fontSize: 14, color: '#94A3B8', marginLeft: 6 },
  
  chartSection: { 
    alignItems: 'center', 
    marginBottom: 32,
  },
  chartTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#374151', 
    marginBottom: 16,
    textAlign: 'center',
  },
  barChartContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  barChart: { 
    borderRadius: 16,
  },
  barChartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  
  pieChartContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  pieChartWrapper: {
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    paddingLeft:120,
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
  
  sectorsContainer: { 
    backgroundColor: '#F8FAFC', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectorTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#374151', 
    marginBottom: 16,
  },
  sectorCard: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    backgroundColor: 'white', 
    borderRadius: 12, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectorInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1,
  },
  sectorIcon: { marginRight: 16 },
  sectorName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1F2937',
  },
  sectorValues: { 
    alignItems: 'flex-end',
  },
  percentage: { 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  sectorAmount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarContainer: { 
    width: '100%', 
    height: 8, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 4, 
    overflow: 'hidden', 
    marginBottom: 8,
  },
  progressBar: { 
    height: '100%', 
    borderRadius: 4,
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
  
  // New styles for enhanced pie chart modal
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
  
  timeSeriesItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTimeSeriesItem: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  yearText: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  gdpText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1E3A8A',
    flex: 1,
    textAlign: 'center',
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    flex: 1,
    textAlign: 'right',
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
  },
  footerText: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textAlign: 'center', 
    marginBottom: 4,
  },
  sectorDataContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  sectorDataText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
});