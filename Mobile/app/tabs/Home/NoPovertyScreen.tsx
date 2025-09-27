/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Dimensions,Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MapView, { Marker, Callout, Circle, Heatmap } from 'react-native-maps';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

export default function NoPovertyScreen() {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);
  const [trendsTarget, setTrendsTarget] = useState(null);

  const targets = [
    { id: '1.1', title: 'Extreme Poverty Eradication', progress: 34, icon: 'attach-money', location: true },
    { id: '1.2', title: 'National Poverty Reduction', progress: 63, icon: 'groups', location: true },
    { id: '1.3', title: 'Social Protection Systems', progress: 78, icon: 'security', location: true },
    { id: '1.4', title: 'Equal Rights & Resources', progress: 27, icon: 'home', location: true },
    { id: '1.5', title: 'Climate Resilience', progress: 52, icon: 'eco', location: true },
    { id: '1.a', title: 'Resource Mobilization', progress: 45, icon: 'account-balance', location: true },
    { id: '1.b', title: 'Policy Frameworks', progress: 20, icon: 'policy', location: true },
  ];

  const targetDetails = {
    '1.1': {
      description: 'By 2030, eradicate extreme poverty for all people everywhere, currently measured as people living on less than $1.25 a day.',
      proportion: '34%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#FF6B6B',
      icon: 'attach-money',
      region: {
        latitude: -1.9403,
        longitude: 29.8739,
        latitudeDelta: 3.0,
        longitudeDelta: 3.0,
      },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 34, title: 'Kigali', description: '34% extreme poverty' },
        { latitude: -2.2876, longitude: 29.9188, value: 42, title: 'Butare', description: '42% extreme poverty' },
        { latitude: -1.6778, longitude: 29.2267, value: 28, title: 'Musanze', description: '28% extreme poverty' },
        { latitude: -2.6289, longitude: 29.1380, value: 51, title: 'Nyanza', description: '51% extreme poverty' },
      ],
      trends: [
        { year: '2014', value: 39.1, target: 45 },
        { year: '2017', value: 34.2, target: 38 },
        { year: '2020', value: 30.3, target: 32 },
        { year: '2023', value: 26.3, target: 25 },
        { year: '2026', value: 22, target: 18 },
        { year: '2030', value: 15, target: 10 },
      ],
      metrics: [
        { label: 'Population Below $1.25/day', value: '2.8M', change: '-12%', icon: 'trending-down' },
        { label: 'Rural Poverty Rate', value: '42%', change: '-8%', icon: 'trending-down' },
        { label: 'Urban Poverty Rate', value: '18%', change: '-5%', icon: 'trending-down' },
        { label: 'Children in Poverty', value: '31%', change: '-15%', icon: 'trending-down' },
      ]
    },
    '1.2': {
      description: 'By 2030, reduce at least by half the proportion of men, women and children living in poverty according to national definitions.',
      proportion: '63%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#4ECDC4',
      icon: 'groups',
      region: {
        latitude: -1.9403,
        longitude: 29.8739,
        latitudeDelta: 3.0,
        longitudeDelta: 3.0,
      },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 63, title: 'Kigali', description: '63% national poverty' },
        { latitude: -2.2876, longitude: 29.9188, value: 71, title: 'Butare', description: '71% national poverty' },
        { latitude: -1.6778, longitude: 29.2267, value: 58, title: 'Musanze', description: '58% national poverty' },
      ],
      trends: [
        { year: '2014', value: 45.2, target: 50 },
        { year: '2017', value: 38.8, target: 42 },
        { year: '2020', value: 35.1, target: 36 },
        { year: '2023', value: 31.7, target: 30 },
        { year: '2026', value: 28, target: 25 },
        { year: '2030', value: 20, target: 15 },
      ],
      metrics: [
        { label: 'National Poverty Line', value: '159 RWF/day', change: '+5%', icon: 'trending-up' },
        { label: 'Multi-dimensional Poverty', value: '63%', change: '-7%', icon: 'trending-down' },
        { label: 'Food Poverty Rate', value: '21%', change: '-12%', icon: 'trending-down' },
        { label: 'Gender Gap', value: '3.2%', change: '-1.1%', icon: 'trending-down' },
      ]
    },
    '1.3': {
      description: 'Implement nationally appropriate social protection systems and measures for all, including floors.',
      proportion: '78%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#45B7D1',
      icon: 'security',
      region: {
        latitude: -1.9403,
        longitude: 29.8739,
        latitudeDelta: 3.0,
        longitudeDelta: 3.0,
      },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 78, title: 'Kigali', description: '78% social protection coverage' },
        { latitude: -2.2876, longitude: 29.9188, value: 82, title: 'Butare', description: '82% coverage' },
      ],
      trends: [
        { year: '2014', value: 45, target: 50 },
        { year: '2017', value: 58, target: 60 },
        { year: '2020', value: 68, target: 70 },
        { year: '2023', value: 78, target: 75 },
        { year: '2026', value: 85, target: 85 },
        { year: '2030', value: 95, target: 95 },
      ],
      metrics: [
        { label: 'VUP Coverage', value: '2.1M', change: '+18%', icon: 'trending-up' },
        { label: 'Health Insurance', value: '89%', change: '+12%', icon: 'trending-up' },
        { label: 'Pension Coverage', value: '45%', change: '+25%', icon: 'trending-up' },
        { label: 'Disability Benefits', value: '67%', change: '+15%', icon: 'trending-up' },
      ]
    },
    // Add similar detailed data for other targets...
    '1.4': {
      description: 'By 2030, ensure equal rights to economic resources, basic services, ownership and control over land.',
      proportion: '27%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#96CEB4',
      icon: 'home',
      region: { latitude: -1.9403, longitude: 29.8739, latitudeDelta: 3.0, longitudeDelta: 3.0 },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 27, title: 'Kigali', description: '27% land ownership equality' },
      ],
      trends: [
        { year: '2014', value: 15, target: 20 },
        { year: '2017', value: 19, target: 25 },
        { year: '2020', value: 23, target: 30 },
        { year: '2023', value: 27, target: 32 },
        { year: '2026', value: 35, target: 40 },
        { year: '2030', value: 50, target: 55 },
      ],
      metrics: [
        { label: 'Women Land Ownership', value: '27%', change: '+8%', icon: 'trending-up' },
        { label: 'Access to Credit', value: '34%', change: '+12%', icon: 'trending-up' },
        { label: 'Financial Inclusion', value: '89%', change: '+15%', icon: 'trending-up' },
        { label: 'Digital Payment Usage', value: '78%', change: '+22%', icon: 'trending-up' },
      ]
    },
    '1.5': {
      description: 'Build resilience of the poor and vulnerable to climate-related extreme events.',
      proportion: '52%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#FFEAA7',
      icon: 'eco',
      region: { latitude: -1.9403, longitude: 29.8739, latitudeDelta: 3.0, longitudeDelta: 3.0 },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 52, title: 'Kigali', description: '52% climate resilience' },
      ],
      trends: [
        { year: '2014', value: 25, target: 30 },
        { year: '2017', value: 35, target: 40 },
        { year: '2020', value: 45, target: 48 },
        { year: '2023', value: 52, target: 55 },
        { year: '2026', value: 65, target: 68 },
        { year: '2030', value: 80, target: 85 },
      ],
      metrics: [
        { label: 'Climate Adaptation Plans', value: '52%', change: '+20%', icon: 'trending-up' },
        { label: 'Disaster Risk Reduction', value: '68%', change: '+15%', icon: 'trending-up' },
        { label: 'Weather Insurance', value: '23%', change: '+35%', icon: 'trending-up' },
        { label: 'Early Warning Systems', value: '89%', change: '+18%', icon: 'trending-up' },
      ]
    },
    '1.a': {
      description: 'Ensure significant mobilization of resources for poverty eradication programmes.',
      proportion: '45%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#DDA0DD',
      icon: 'account-balance',
      region: { latitude: -1.9403, longitude: 29.8739, latitudeDelta: 3.0, longitudeDelta: 3.0 },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 45, title: 'Kigali', description: '45% resource mobilization' },
      ],
      trends: [
        { year: '2014', value: 20, target: 25 },
        { year: '2017', value: 30, target: 35 },
        { year: '2020', value: 38, target: 42 },
        { year: '2023', value: 45, target: 48 },
        { year: '2026', value: 58, target: 60 },
        { year: '2030', value: 75, target: 80 },
      ],
      metrics: [
        { label: 'Development Aid', value: '$1.2B', change: '+8%', icon: 'trending-up' },
        { label: 'Domestic Revenue', value: '18% GDP', change: '+12%', icon: 'trending-up' },
        { label: 'Private Investment', value: '$890M', change: '+25%', icon: 'trending-up' },
        { label: 'Poverty Program Budget', value: '12% National Budget', change: '+15%', icon: 'trending-up' },
      ]
    },
    '1.b': {
      description: 'Create sound policy frameworks based on pro-poor and gender-sensitive development strategies.',
      proportion: '20%',
      source: 'NISR 2023',
      lastUpdated: '2023',
      color: '#FF7675',
      icon: 'policy',
      region: { latitude: -1.9403, longitude: 29.8739, latitudeDelta: 3.0, longitudeDelta: 3.0 },
      locations: [
        { latitude: -1.9403, longitude: 29.8739, value: 20, title: 'Kigali', description: '20% policy framework completion' },
      ],
      trends: [
        { year: '2014', value: 5, target: 10 },
        { year: '2017', value: 12, target: 15 },
        { year: '2020', value: 16, target: 20 },
        { year: '2023', value: 20, target: 25 },
        { year: '2026', value: 30, target: 35 },
        { year: '2030', value: 50, target: 55 },
      ],
      metrics: [
        { label: 'Policy Frameworks', value: '20%', change: '+25%', icon: 'trending-up' },
        { label: 'Gender Integration', value: '67%', change: '+18%', icon: 'trending-up' },
        { label: 'Implementation Rate', value: '78%', change: '+12%', icon: 'trending-up' },
        { label: 'Monitoring Systems', value: '45%', change: '+30%', icon: 'trending-up' },
      ]
    },
  };

  const getIconComponent = (iconName, size = 24, color = 'white') => {
    const iconMap = {
      'attach-money': () => <MaterialIcons name="attach-money" size={size} color={color} />,
      'groups': () => <MaterialIcons name="groups" size={size} color={color} />,
      'security': () => <MaterialIcons name="security" size={size} color={color} />,
      'home': () => <MaterialIcons name="home" size={size} color={color} />,
      'eco': () => <MaterialIcons name="eco" size={size} color={color} />,
      'account-balance': () => <MaterialIcons name="account-balance" size={size} color={color} />,
      'policy': () => <MaterialIcons name="policy" size={size} color={color} />,
    };
    return iconMap[iconName] ? iconMap[iconName]() : <Ionicons name="help" size={size} color={color} />;
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f8f9fa',
    color: (opacity = 1) => `rgba(229, 36, 59, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  };

  const renderModal = () => {
    if (!selectedTarget || !targetDetails[selectedTarget]) return null;
    
    const target = targetDetails[selectedTarget];
    
    return (
      <Modal visible={selectedTarget !== null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: target.color + '10' }]}>
            <View style={[styles.modalHeader, { backgroundColor: target.color }]}>
              {getIconComponent(target.icon, 36, 'white')}
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Target {selectedTarget}</Text>
                <Text style={styles.modalSubtitle}>{targets.find(t => t.id === selectedTarget)?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTarget(null)} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDescription}>{target.description}</Text>
              
              {/* Key Metrics */}
              <View style={styles.metricsContainer}>
                <Text style={styles.sectionTitle}>Key Metrics</Text>
                <View style={styles.metricsGrid}>
                  {target.metrics?.map((metric, index) => (
                    <View key={index} style={[styles.metricCard, { borderLeftColor: target.color }]}>
                      <View style={styles.metricHeader}>
                        <Ionicons name={metric.icon} size={20} color={target.color} />
                        <Text style={[styles.metricChange, { color: metric.change.startsWith('+') ? '#27AE60' : '#E74C3C' }]}>
                          {metric.change}
                        </Text>
                      </View>
                      <Text style={styles.metricValue}>{metric.value}</Text>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Data Source */}
              <View style={styles.sourceContainer}>
                <MaterialIcons name="source" size={20} color="#666" />
                <View style={styles.sourceText}>
                  <Text style={styles.sourceTitle}>Data Source</Text>
                  <Text style={styles.sourceDetail}>{target.source} • Last updated: {target.lastUpdated}</Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  onPress={() => { 
                    setMapTarget(selectedTarget);
                    setShowMap(true); 
                    setSelectedTarget(null); 
                  }} 
                  style={[styles.actionButton, { backgroundColor: target.color }]}
                >
                  <MaterialIcons name="map" size={20} color="white" />
                  <Text style={styles.actionButtonText}>View Geographic Data</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => { 
                    setTrendsTarget(selectedTarget);
                    setShowTrends(true); 
                    setSelectedTarget(null); 
                  }} 
                  style={[styles.actionButton, { backgroundColor: target.color }]}
                >
                  <MaterialIcons name="trending-up" size={20} color="white" />
                  <Text style={styles.actionButtonText}>View Trends & Analytics</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMapModal = () => {
    if (!showMap || !mapTarget || !targetDetails[mapTarget]) return null;
    
    const target = targetDetails[mapTarget];
    
    return (
      <Modal visible={showMap} transparent={true} animationType="slide">
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenContent}>
            <View style={[styles.fullScreenHeader, { backgroundColor: target.color }]}>
              <View style={styles.headerLeft}>
                {getIconComponent(target.icon, 28, 'white')}
                <Text style={styles.fullScreenTitle}>Geographic Distribution - Target {mapTarget}</Text>
              </View>
              <TouchableOpacity onPress={() => { setShowMap(false); setMapTarget(null); }} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <MapView
              style={styles.fullScreenMap}
              region={target.region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              mapType="hybrid"
            >
              {target.locations?.map((location, index) => (
                <Marker 
                  key={index}
                  coordinate={location}
                  title={location.title}
                  description={location.description}
                >
                  <View style={[styles.customMarker, { backgroundColor: target.color }]}>
                    {getIconComponent(target.icon, 16, 'white')}
                    <Text style={styles.markerText}>{location.value}%</Text>
                  </View>
                  <Callout style={styles.callout}>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>{location.title}</Text>
                      <Text style={styles.calloutDescription}>{location.description}</Text>
                      <View style={styles.calloutProgress}>
                        <View style={[styles.progressBar, { backgroundColor: target.color + '20' }]}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                backgroundColor: target.color, 
                                width: `${location.value}%` 
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.progressText, { color: target.color }]}>{location.value}%</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}
              
              {target.locations?.map((location, index) => (
                <Circle
                  key={`circle-${index}`}
                  center={location}
                  radius={location.value * 500} // Adjust radius based on value
                  fillColor={target.color + '30'}
                  strokeColor={target.color}
                  strokeWidth={2}
                />
              ))}
            </MapView>
            
            <View style={styles.mapLegend}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: target.color }]} />
                <Text style={styles.legendText}>Higher concentration areas</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: target.color + '50' }]} />
                <Text style={styles.legendText}>Moderate concentration areas</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderTrendsModal = () => {
    if (!showTrends || !trendsTarget || !targetDetails[trendsTarget]) return null;
    
    const target = targetDetails[trendsTarget];
    
    const lineData = {
      labels: target.trends.map(t => t.year),
      datasets: [
        {
          data: target.trends.map(t => t.value),
          color: (opacity = 1) => target.color,
          strokeWidth: 3,
        },
        {
          data: target.trends.map(t => t.target),
          color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
          strokeWidth: 2,
          withDots: false,
        }
      ],
    };

    const barData = {
      labels: target.trends.slice(-4).map(t => t.year),
      datasets: [{
        data: target.trends.slice(-4).map(t => t.value),
      }]
    };
    
    return (
      <Modal visible={showTrends} transparent={true} animationType="slide">
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenContent}>
            <View style={[styles.fullScreenHeader, { backgroundColor: target.color }]}>
              <View style={styles.headerLeft}>
                <MaterialIcons name="trending-up" size={28} color="white" />
                <Text style={styles.fullScreenTitle}>Trends & Analytics - Target {trendsTarget}</Text>
              </View>
              <TouchableOpacity onPress={() => { setShowTrends(false); setTrendsTarget(null); }} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.trendsBody} showsVerticalScrollIndicator={false}>
              {/* Progress Overview */}
              <View style={styles.progressOverview}>
                <Text style={styles.sectionTitle}>Progress Overview</Text>
                <View style={styles.overviewCards}>
                  <View style={[styles.overviewCard, { backgroundColor: target.color + '10' }]}>
                    <MaterialIcons name="timeline" size={32} color={target.color} />
                    <Text style={[styles.overviewValue, { color: target.color }]}>
                      {target.trends[target.trends.length - 1].value}%
                    </Text>
                    <Text style={styles.overviewLabel}>Current Progress</Text>
                  </View>
                  <View style={styles.overviewCard}>
                    <MaterialIcons name="flag" size={32} color="#27AE60" />
                    <Text style={[styles.overviewValue, { color: '#27AE60' }]}>
                      {target.trends[target.trends.length - 1].target}%
                    </Text>
                    <Text style={styles.overviewLabel}>2030 Target</Text>
                  </View>
                  <View style={styles.overviewCard}>
                    <MaterialIcons name="speed" size={32} color="#3498DB" />
                    <Text style={[styles.overviewValue, { color: '#3498DB' }]}>
                      {(target.trends[target.trends.length - 1].value - target.trends[0].value).toFixed(1)}%
                    </Text>
                    <Text style={styles.overviewLabel}>Total Improvement</Text>
                  </View>
                </View>
              </View>
              
              {/* Line Chart */}
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Historical Trends (2014-2030)</Text>
                <Text style={styles.chartSubtitle}>Progress vs Targets</Text>
                <LineChart
                  data={lineData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => target.color,
                  }}
                  bezier
                  style={styles.chart}
                  decorator={() => null}
                  onDataPointClick={(data) => {
                    console.log('Data point clicked:', data);
                  }}
                />
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: target.color }]} />
                    <Text style={styles.legendText}>Actual Progress</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: '#969696' }]} />
                    <Text style={styles.legendText}>Target</Text>
                  </View>
                </View>
              </View>
              
              {/* Bar Chart */}
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Recent Performance</Text>
                <Text style={styles.chartSubtitle}>Last 4 Years Comparison</Text>
                <BarChart
                  data={barData}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => target.color,
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars={true}
                />
              </View>
              
              {/* Key Insights */}
              <View style={styles.insightsSection}>
                <Text style={styles.sectionTitle}>Key Insights</Text>
                <View style={styles.insightsList}>
                  <View style={styles.insightItem}>
                    <MaterialIcons name="insights" size={20} color={target.color} />
                    <Text style={styles.insightText}>
                      Progress has improved by {(target.trends[target.trends.length - 1].value - target.trends[0].value).toFixed(1)}% since 2014
                    </Text>
                  </View>
                  <View style={styles.insightItem}>
                    <MaterialIcons name="trending-up" size={20} color="#27AE60" />
                    <Text style={styles.insightText}>
                      Current trajectory suggests meeting 2030 targets is {target.trends[target.trends.length - 1].value >= target.trends[target.trends.length - 1].target * 0.8 ? 'achievable' : 'challenging'}
                    </Text>
                  </View>
                  <View style={styles.insightItem}>
                    <MaterialIcons name="schedule" size={20} color="#3498DB" />
                    <Text style={styles.insightText}>
                      Average annual improvement rate: {((target.trends[target.trends.length - 1].value - target.trends[0].value) / (target.trends.length - 1)).toFixed(2)}% per year
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5243B' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
              <Image
                                  source={require('../../../Assets/Images/nopoverty.png')}
                                  style={styles.logo}
                                  resizeMode="contain"
                                />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>No Poverty</Text>
            <Text style={styles.headerSubtitle}>End poverty in all its forms everywhere</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search targets, metrics, or locations..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity>
              <MaterialIcons name="mic" size={20} color="#E5243B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="trending-down" size={24} color="#27AE60" />
            <Text style={styles.statValue}>34%</Text>
            <Text style={styles.statLabel}>Overall Progress</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="location-on" size={24} color="#3498DB" />
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Active Targets</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="update" size={24} color="#E5243B" />
            <Text style={styles.statValue}>2023</Text>
            <Text style={styles.statLabel}>Last Updated</Text>
          </View>
        </View>

        {/* Targets List */}
        <Text style={styles.sectionHeader}>Sustainable Development Targets</Text>
        {targets.map((target) => (
          <TouchableOpacity
            key={target.id}
            onPress={() => setSelectedTarget(target.id)}
            style={styles.targetContainer}
          >
            <View style={styles.targetLeft}>
              <View style={[styles.targetIcon, { backgroundColor: targetDetails[target.id]?.color || '#E5243B' }]}>
                {getIconComponent(target.icon, 24, 'white')}
              </View>
              <View style={styles.targetInfo}>
                <Text style={styles.targetTitle}>{target.title}</Text>
                <Text style={styles.targetId}>Target {target.id}</Text>
              </View>
            </View>
            <View style={styles.targetRight}>
              <AnimatedCircularProgress
                size={50}
                width={6}
                fill={target.progress}
                tintColor={targetDetails[target.id]?.color || '#E5243B'}
                backgroundColor="#f0f0f0"
                rotation={0}
              >
                {() => (
                  <Text style={[styles.progressText, { color: targetDetails[target.id]?.color || '#E5243B' }]}>
                    {`${target.progress}%`}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <View style={styles.targetActions}>
                <TouchableOpacity 
                  onPress={() => { 
                    setMapTarget(target.id);
                    setShowMap(true);
                  }}
                  style={styles.actionIcon}
                >
                  <MaterialIcons name="map" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => { 
                    setTrendsTarget(target.id);
                    setShowTrends(true);
                  }}
                  style={styles.actionIcon}
                >
                  <MaterialIcons name="trending-up" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Render Modals */}
      {renderModal()}
      {renderMapModal()}
      {renderTrendsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#E5243B',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
      logo: {
    width: 120,
    height: 70,
   
    marginBottom: -10,

  },
  headerIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerNumber: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    top: 8,
    left: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Search Styles
  searchContainer: {
    backgroundColor: '#E5243B',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

  // Statistics Styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
  },

  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
  },

  // Target Item Styles
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    elevation: 1,
  },
  targetLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  targetIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  targetInfo: {
    flex: 1,
  },
  targetTitle: { 
    fontSize: 16, 
    color: '#2C3E50', 
    fontWeight: '600',
    marginBottom: 4,
  },
  targetId: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  targetRight: { 
    alignItems: 'center',
  },
  targetActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionIcon: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalHeaderText: {
    flex: 1,
    marginLeft: 15,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  closeIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  modalBody: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalDescription: { 
    fontSize: 16, 
    color: '#2C3E50', 
    lineHeight: 24,
    marginBottom: 20,
  },

  // Metrics Styles
  metricsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },

  // Source Styles
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sourceText: {
    marginLeft: 12,
    flex: 1,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  sourceDetail: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },

  // Action Button Styles
  modalButtonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Full Screen Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  fullScreenContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white',
    marginLeft: 12,
    flex: 1,
  },

  // Map Styles
  fullScreenMap: { 
    flex: 1,
  },
  customMarker: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  calloutProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Map Legend Styles
  mapLegend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#2C3E50',
  },

  // Trends Modal Styles
  trendsBody: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  progressOverview: {
    marginBottom: 25,
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    margin: 5,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
  },

  // Chart Styles
  chartSection: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  // Insights Styles
  insightsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightsList: {
    gap: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 12,
    lineHeight: 20,
  },
});