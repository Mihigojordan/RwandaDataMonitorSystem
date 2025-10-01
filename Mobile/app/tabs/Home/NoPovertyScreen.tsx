/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Dimensions, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function NoPovertyScreen() {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);
  const [trendsTarget, setTrendsTarget] = useState(null);
  const [targets, setTargets] = useState([]);
  const [filteredTargets, setFilteredTargets] = useState([]);
  const [targetDetails, setTargetDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF7675'];
  const defaultIcons = ['attach-money', 'groups', 'security', 'home', 'eco', 'account-balance', 'policy'];

  const mockCoordinates = [
    { latitude: 9.02497, longitude: 38.74689 },
    { latitude: 7.93333, longitude: 38.71667 },
    { latitude: 11.13333, longitude: 39.63333 },
    { latitude: 14.03233, longitude: 38.31667 },
    { latitude: 8.9806, longitude: 38.7578 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.20.10.2:8000/no-poverty-targets');
        const apiData = response.data;

        const validData = apiData.filter(
          (item) =>
            (!item.trend || item.trend.every((t) => t.year <= 2025)) &&
            (!item.map || item.map.every((m) => m.year <= 2025))
        );

        const transformedTargets = validData.map((item, index) => ({
          id: item.id,
          title: item.targetName,
          progress: item.targetPercentage,
          icon: defaultIcons[index % defaultIcons.length],
          location: item.map && item.map.length > 0,
        }));

        const transformedDetails = validData.reduce((acc, item, index) => {
          acc[item.id] = {
            title: item.targetName,
            description: item.targetDescription,
            proportion: `${item.targetPercentage}%`,
            source: item.source,
            lastUpdated: new Date(item.updatedAt).getFullYear().toString(),
            color: defaultColors[index % defaultColors.length],
            icon: defaultIcons[index % defaultIcons.length],
            region: {
              latitude: 9.02497,
              longitude: 38.74689,
              latitudeDelta: 3.0,
              longitudeDelta: 3.0,
            },
            locations: item.map
              ? item.map.map((loc, locIndex) => ({
                  ...mockCoordinates[locIndex % mockCoordinates.length],
                  value: loc.povertyRate,
                  title: loc.location,
                  description: `${loc.povertyRate}% poverty rate in ${loc.location} (${loc.year})`,
                }))
              : [],
            trends: item.trend
              ? item.trend.map((trend) => ({
                  year: trend.year.toString(),
                  value: trend.percentage,
                  target: trend.percentage + 5,
                }))
              : [],
            metrics: [
              { label: 'Poverty Rate', value: `${item.targetPercentage}%`, change: 'N/A', icon: 'trending-flat' },
            ],
          };
          return acc;
        }, {});

        setTargets(transformedTargets);
        setFilteredTargets(transformedTargets);
        setTargetDetails(transformedDetails);
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTargets(targets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = targets.filter((target) => {
      const details = targetDetails[target.id];
      return (
        target.title.toLowerCase().includes(query) ||
        (details.description && details.description.toLowerCase().includes(query)) ||
        details.metrics.some((metric) => metric.label.toLowerCase().includes(query) || metric.value.toLowerCase().includes(query))
      );
    });

    setFilteredTargets(filtered);
  }, [searchQuery, targets, targetDetails]);

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
      fontWeight: '600',
      fontFamily: 'System',
    },
  };

  const renderModal = () => {
    if (!selectedTarget || !targetDetails[selectedTarget]) return null;

    const target = targetDetails[selectedTarget];

    return (
      <Modal visible={selectedTarget !== null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: '#fff' }]}>
            <View style={[styles.modalHeader, { backgroundColor: target.color }]}>
              {getIconComponent(target.icon, 32, '#fff')}
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>{target.title}</Text>
                <Text style={styles.modalSubtitle}>Target Details</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTarget(null)} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDescription}>{target.description}</Text>

              <View style={styles.metricsContainer}>
                <Text style={styles.sectionTitle}>Key Metrics</Text>
                <View style={[styles.metricCard, { borderLeftColor: target.color }]}>
                  {target.metrics.map((metric, index) => (
                    <View key={index} style={styles.metricItem}>
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
                  <View style={styles.sourceContainer}>
                    <MaterialIcons name="source" size={20} color="#666" />
                    <View style={styles.sourceText}>
                      <Text style={styles.sourceTitle}>Data Source</Text>
                      <Text style={styles.sourceDetail}>{target.source} • Updated: {target.lastUpdated}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.modalButtonContainer}>
                {target.locations.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setMapTarget(selectedTarget);
                      setShowMap(true);
                      setSelectedTarget(null);
                    }}
                    style={[styles.actionButton, { backgroundColor: target.color }]}
                  >
                    <MaterialIcons name="map" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>View Map</Text>
                  </TouchableOpacity>
                )}
                {target.trends.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setTrendsTarget(selectedTarget);
                      setShowTrends(true);
                      setSelectedTarget(null);
                    }}
                    style={[styles.actionButton, { backgroundColor: target.color }]}
                  >
                    <MaterialIcons name="trending-up" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>View Trends</Text>
                  </TouchableOpacity>
                )}
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
                {getIconComponent(target.icon, 28, '#fff')}
                <Text style={styles.fullScreenTitle}>Map - {target.title}</Text>
              </View>
              <TouchableOpacity onPress={() => { setShowMap(false); setMapTarget(null); }} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <MapView
              style={styles.fullScreenMap}
              region={target.region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              mapType="hybrid"
            >
              {target.locations.map((location, index) => (
                <Marker
                  key={index}
                  coordinate={location}
                  title={location.title}
                  description={location.description}
                >
                  <View style={[styles.customMarker, { backgroundColor: target.color }]}>
                    {getIconComponent(target.icon, 16, '#fff')}
                    <Text style={styles.markerText}>{location.value}%</Text>
                  </View>
                  <Callout style={styles.callout}>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>{location.title}</Text>
                      <Text style={styles.calloutDescription}>{location.description}</Text>
                      <View style={styles.calloutProgress}>
                        <View style={[styles.progressBar, { backgroundColor: target.color + '20' }]}>
                          <View
                            style={[styles.progressFill, { backgroundColor: target.color, width: `${location.value}%` }]}
                          />
                        </View>
                        <Text style={[styles.progressText, { color: target.color }]}>{location.value}%</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}

              {target.locations.map((location, index) => (
                <Circle
                  key={`circle-${index}`}
                  center={location}
                  radius={location.value * 500}
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
                <Text style={styles.legendText}>High Poverty Areas</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: target.color + '50' }]} />
                <Text style={styles.legendText}>Moderate Poverty Areas</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderTrendsModal = () => {
    if (!showTrends || !trendsTarget || !targetDetails[trendsTarget] || targetDetails[trendsTarget].trends.length === 0) return null;

    const target = targetDetails[trendsTarget];

    const lineData = {
      labels: target.trends.map((t) => t.year),
      datasets: [
        {
          data: target.trends.map((t) => t.value),
          color: (opacity = 1) => target.color,
          strokeWidth: 3,
        },
        {
          data: target.trends.map((t) => t.target),
          color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
          strokeWidth: 2,
          withDots: false,
        },
      ],
    };

    const barData = {
      labels: target.trends.slice(-4).map((t) => t.year),
      datasets: [
        {
          data: target.trends.slice(-4).map((t) => t.value),
        },
      ],
    };

    return (
      <Modal visible={showTrends} transparent={true} animationType="slide">
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenContent}>
            <View style={[styles.fullScreenHeader, { backgroundColor: target.color }]}>
              <View style={styles.headerLeft}>
                <MaterialIcons name="trending-up" size={28} color="#fff" />
                <Text style={styles.fullScreenTitle}>Trends - {target.title}</Text>
              </View>
              <TouchableOpacity onPress={() => { setShowTrends(false); setTrendsTarget(null); }} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.trendsBody} showsVerticalScrollIndicator={false}>
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
                    <Text style={styles.overviewLabel}>Target</Text>
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

              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Historical Trends</Text>
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

              <View style={styles.insightsSection}>
                <Text style={styles.sectionTitle}>Key Insights</Text>
                <View style={styles.insightsList}>
                  <View style={styles.insightItem}>
                    <MaterialIcons name="insights" size={20} color={target.color} />
                    <Text style={styles.insightText}>
                      Progress has improved by {(target.trends[target.trends.length - 1].value - target.trends[0].value).toFixed(1)}% since {target.trends[0].year}
                    </Text>
                  </View>
                  <View style={styles.insightItem}>
                    <MaterialIcons name="trending-up" size={20} color="#27AE60" />
                    <Text style={styles.insightText}>
                      Current trajectory suggests meeting targets is {target.trends[target.trends.length - 1].value >= target.trends[target.trends.length - 1].target * 0.8 ? 'achievable' : 'challenging'}
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#D32F2F" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search targets, metrics, or locations..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="trending-down" size={24} color="#27AE60" />
              <Text style={styles.statValue}>
                {targets.length > 0
                  ? `${Math.round(targets.reduce((sum, t) => sum + t.progress, 0) / targets.length)}%`
                  : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Overall Progress</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="location-on" size={24} color="#3498DB" />
              <Text style={styles.statValue}>{filteredTargets.length}</Text>
              <Text style={styles.statLabel}>Active Targets</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="update" size={24} color="#E74C3C" />
              <Text style={styles.statValue}>2025</Text>
              <Text style={styles.statLabel}>Last Updated</Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Sustainable Development Targets</Text>
          {filteredTargets.length === 0 ? (
            <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
          ) : (
            filteredTargets.map((target) => (
              <TouchableOpacity
                key={target.id}
                onPress={() => setSelectedTarget(target.id)}
                style={styles.targetContainer}
              >
                <View style={styles.targetLeft}>
                  <View style={[styles.targetIcon, { backgroundColor: targetDetails[target.id]?.color || '#E74C3C' }]}>
                    {getIconComponent(target.icon, 24, '#fff')}
                  </View>
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetTitle}>{target.title}</Text>
                    <Text style={styles.targetId}>Target {target.id.slice(0, 8)}</Text>
                  </View>
                </View>
                <View style={styles.targetRight}>
                  <AnimatedCircularProgress
                    size={50}
                    width={6}
                    fill={target.progress}
                    tintColor={targetDetails[target.id]?.color || '#E74C3C'}
                    backgroundColor="#e0e0e0"
                    rotation={0}
                  >
                    {() => (
                      <Text style={[styles.progressText, { color: targetDetails[target.id]?.color || '#E74C3C' }]}>
                        {`${target.progress}%`}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <View style={styles.targetActions}>
                    {target.location && (
                      <TouchableOpacity
                        onPress={() => {
                          setMapTarget(target.id);
                          setShowMap(true);
                        }}
                        style={styles.actionIcon}
                      >
                        <MaterialIcons name="map" size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                    {targetDetails[target.id]?.trends.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setTrendsTarget(target.id);
                          setShowTrends(true);
                        }}
                        style={styles.actionIcon}
                      >
                        <MaterialIcons name="trending-up" size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {renderModal()}
        {renderMapModal()}
        {renderTrendsModal()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingTop: 40,
    backgroundColor: '#D32F2F',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 60,
  },
  headerIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'System',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontFamily: 'System',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'System',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    fontFamily: 'System',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 16,
    fontFamily: 'System',
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 2,
  },
  targetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  targetIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  targetInfo: {
    flex: 1,
  },
  targetTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  targetId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  targetRight: {
    alignItems: 'flex-end',
  },
  targetActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionIcon: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.92,
    maxHeight: height * 0.85,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    fontFamily: 'System',
  },
  closeIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  modalBody: {
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: height * 0.65,
  },
  modalDescription: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'System',
  },
  metricsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'System',
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricItem: {
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sourceText: {
    marginLeft: 8,
    flex: 1,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  sourceDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },
  modalButtonContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullScreenContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'System',
  },
  fullScreenMap: {
    flex: 1,
  },
  customMarker: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'System',
  },
  callout: {
    width: 180,
  },
  calloutContent: {
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'System',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'System',
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
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
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
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  trendsBody: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  progressOverview: {
    marginBottom: 20,
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    fontFamily: 'System',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'System',
  },
  chartSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'System',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  insightsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 12,
    lineHeight: 20,
    fontFamily: 'System',
  },
});