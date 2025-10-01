import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function RwandaGDPCurrentPrice() {
  const { t } = useTranslation();
  const [gdpData, setGdpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendsModalVisible, setTrendsModalVisible] = useState(false);

  useEffect(() => {
    fetchGDPData();
  }, []);

  const fetchGDPData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://172.20.10.2:8000/gdp-current-price');
      
      if (!response.ok) {
        throw new Error('Failed to fetch GDP data');
      }
      
      const data = await response.json();
      
      // Find the first item with valid data structure
      const validData = data.find(item => item.lastYear && item.currentYear && item.trends);
      
      if (validData) {
        setGdpData(validData);
      } else {
        throw new Error('No valid GDP data found');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching GDP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendsChartData = () => {
    if (!gdpData || !gdpData.trends) return null;

    const labels = gdpData.trends.map(trend => `${trend.quarter} ${trend.year}`);
    const data = gdpData.trends.map(trend => trend.money);

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const calculateGrowth = () => {
    if (!gdpData || !gdpData.lastYear || !gdpData.currentYear) return null;
    
    const lastYearValue = gdpData.lastYear.money;
    const currentYearValue = gdpData.currentYear.money;
    const growth = ((currentYearValue - lastYearValue) / lastYearValue) * 100;
    
    return growth.toFixed(2);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>{t('gdp_current_price.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('gdp_current_price.error', { error })}</Text>
        <TouchableOpacity onPress={fetchGDPData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('gdp_current_price.retry_button')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!gdpData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('gdp_current_price.no_data')}</Text>
      </View>
    );
  }

  const trendsChartData = getTrendsChartData();
  const growth = calculateGrowth();

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>{t('gdp_current_price.title')}</Text>
      </View>

      {/* Map-style Comparison */}
      <View style={styles.mapContainer}>
        <Image 
          source={require('../../../Assets/Images/mapimage.jpg')} 
          style={styles.mapImage}
          resizeMode="contain"
        />
        
        {/* Last Year - Left Side */}
        <View style={[styles.mapDataPoint, styles.leftDataPoint]}>
          <Text style={styles.dataPointValue}>
            {gdpData.lastYear.money.toLocaleString()}
          </Text>
          <Text style={styles.dataPointQuarter}>
            {gdpData.lastYear.quarter} {gdpData.lastYear.year}
          </Text>
        </View>

        {/* Current Year - Right Side */}
        <View style={[styles.mapDataPoint, styles.rightDataPoint]}>
          <Text style={[styles.dataPointValue, styles.currentValue]}>
            {gdpData.currentYear.money.toLocaleString()}
          </Text>
          <Text style={[styles.dataPointQuarter, styles.currentQuarter]}>
            {gdpData.currentYear.quarter} {gdpData.currentYear.year}
          </Text>
        </View>

        {/* See Trends Button - Top Right */}
        <TouchableOpacity 
          style={styles.seeTrendsButton}
          onPress={() => setTrendsModalVisible(true)}
        >
          <Text style={styles.seeTrendsIcon}>📈</Text>
          <Text style={styles.seeTrendsText}>{t('gdp_current_price.see_trends_button')}</Text>
        </TouchableOpacity>
      </View>

      {/* Trends Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={trendsModalVisible}
        onRequestClose={() => setTrendsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('gdp_current_price.modal_title')}</Text>
              <TouchableOpacity 
                onPress={() => setTrendsModalVisible(false)}
                style={styles.closeIconButton}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {trendsChartData && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={trendsChartData}
                  width={width - 80}
                  height={300}
                  chartConfig={{
                    backgroundColor: '#F8FAFC',
                    backgroundGradientFrom: '#F1F5F9',
                    backgroundGradientTo: '#E2E8F0',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForLabels: { fontSize: 10, fontWeight: '600' },
                    propsForBackgroundLines: { strokeWidth: 1, stroke: '#CBD5E1' },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#1E3A8A',
                    },
                  }}
                  bezier
                  style={styles.lineChart}
                  yAxisSuffix={t('gdp_current_price.chart_y_axis_suffix')}
                />
              </View>
            )}

            <TouchableOpacity 
              onPress={() => setTrendsModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{t('gdp_current_price.close_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 28,
  },
  mapContainer: {
    marginBottom: 24,
    position: 'relative',
    height: 200,
    width: '100%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapDataPoint: {
    position: 'absolute',
    alignItems: 'center',
  },
  leftDataPoint: {
    top: 80,
    left: 80,
  },
  rightDataPoint: {
    top: 80,
    right: 80,
  },
  dataPointValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  currentValue: {
    fontSize: 24,
    color: '#fff',
  },
  dataPointQuarter: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentQuarter: {
    color: '#fff',
  },
  seeTrendsButton: {
    position: 'absolute',
    top: -2,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 1,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  seeTrendsIcon: {
    fontSize: 16,
  },
  seeTrendsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lineChart: {
    borderRadius: 16,
  },
  closeButton: {
    marginTop: 12,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});