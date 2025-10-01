import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SectorData {
  totalGdp: number;
  servicesShare: number;
  industryShare: number;
  agricultureShare: number;
  servicesSubShares: Record<string, number>;
  agricultureSubShares: Record<string, number>;
  industrySubShares: Record<string, number>;
}

export default function SectorContribution() {
  const { t } = useTranslation();
  const [data, setData] = useState<SectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchGDPData();
  }, []);

  const fetchGDPData = async () => {
    try {
      const response = await fetch('http://172.20.10.2:8000/gdp-growth-by-sector-at-constant-price');
      const result = await response.json();
      if (result && result.length > 0) {
        setData(result[0]);
      }
    } catch (error) {
      console.error('Error fetching GDP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectorConfig = () => {
    if (!data) return [];
    return [
      { 
        name: 'Services', 
        percentage: data.servicesShare, 
        color: '#6366F1', 
        gradientColors: ['#6366F1', '#8B5CF6'],
        icon: 'office-building',
        subShares: data.servicesSubShares
      },
      { 
        name: 'Agriculture', 
        percentage: data.agricultureShare, 
        color: '#10B981', 
        gradientColors: ['#10B981', '#14B8A6'],
        icon: 'sprout',
        subShares: data.agricultureSubShares
      },
      { 
        name: 'Industry', 
        percentage: data.industryShare, 
        color: '#F59E0B', 
        gradientColors: ['#F59E0B', '#EF4444'],
        icon: 'factory',
        subShares: data.industrySubShares
      },
    ];
  };

  const getSubSectorIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      'Trade': 'cart',
      'Transportation': 'truck-delivery',
      'Hotels and Restaurants': 'silverware-fork-knife',
      'Financial Services': 'bank',
      'Government': 'account-balance',
      'Health': 'medical-bag',
      'Education': 'school',
      'ICT': 'laptop',
      'Real Estate': 'home-city',
      'Livestock Products': 'cow',
      'Export Crops': 'leaf',
      'Forestry': 'tree',
      'Food Crops': 'grain',
      'Chemical and Plastic Products': 'flask',
      'Construction': 'hammer-wrench',
      'Food Manufacture': 'food-apple',
      'Textile & Clothing': 'tshirt-crew',
    };
    return iconMap[name] || 'circle';
  };

  const getSubSectorsList = (sectorName: string) => {
    if (!data) return [];
    
    const sector = getSectorConfig().find(s => s.name === sectorName);
    if (!sector) return [];

    return Object.entries(sector.subShares)
      .filter(([_, percentage]) => percentage > 0)
      .map(([name, percentage]) => ({
        name,
        percentage,
        color: sector.color,
        gradientColors: sector.gradientColors,
        icon: getSubSectorIcon(name),
      }));
  };

  const filteredSubSectors = getSubSectorsList(selectedSector || '').filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSubSectorCard = ({ item }: any) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={() => setHoveredCard(item.name)}
      onPressOut={() => setHoveredCard(null)}
    >
      <LinearGradient
        colors={hoveredCard === item.name ? [item.gradientColors[1], item.gradientColors[0]] : item.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.subSectorCard, hoveredCard === item.name && styles.subSectorCardHovered]}
      >
        <View style={styles.subSectorHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon} size={32} color="white" />
          </View>
          <View style={styles.subSectorInfo}>
            <Text style={styles.subSectorName}>{t(`sectors.${item.name}`, item.name)}</Text>
            <Text style={styles.subSectorPercentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        </View>
        <View style={styles.subSectorValue}>
          <Text style={styles.subSectorAmount}>
            ${data ? ((item.percentage / 100) * data.totalGdp).toFixed(0) : 0}M
          </Text>
          <Text style={styles.subSectorLabel}>{t('common.contribution', 'Contribution')}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>{t('common.loading', 'Loading...')}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{t('common.error', 'Failed to load data')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>{t('sectors.title', 'GDP by Sector')}</Text>
        <Text style={styles.subtitle}>{t('sectors.subtitle', 'Economic Contribution Analysis')}</Text>
      </View>

   

      <View style={styles.sectorsContainer}>
        {getSectorConfig().map((sector) => (
          <TouchableOpacity 
            key={sector.name} 
            onPress={() => { 
              setSelectedSector(sector.name); 
              setModalVisible(true);
              setSearchQuery('');
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F9FAFB']}
              style={styles.sectorCard}
            >
              <View style={styles.sectorCardContent}>
                <View style={styles.sectorInfo}>
                  <View style={[styles.sectorIconContainer, { backgroundColor: sector.color + '20' }]}>
                    <MaterialCommunityIcons
                      name={sector.icon}
                      size={28}
                      color={sector.color}
                    />
                  </View>
                  <View>
                    <Text style={styles.sectorName}>{t(`sectors.${sector.name}`, sector.name)}</Text>
                    <Text style={styles.sectorSubtext}>
                      {Object.values(sector.subShares).filter(v => v > 0).length} {t('common.subsectors', 'subsectors')}
                    </Text>
                  </View>
                </View>
                <View style={styles.sectorValues}>
                  <Text style={[styles.percentage, { color: sector.color }]}>
                    {sector.percentage.toFixed(1)}%
                  </Text>
                  <Text style={styles.sectorAmount}>
                    ${((sector.percentage / 100) * data.totalGdp).toFixed(0)}M
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={sector.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${sector.percentage}%` }]}
                />
              </View>
            </LinearGradient>
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
              <View>
                <Text style={styles.modalTitle}>
                  {t(`sectors.${selectedSector}`, selectedSector)} {t('common.sector', 'Sector')}
                </Text>
                <Text style={styles.modalSubtitle}>{t('common.breakdown', 'Detailed Breakdown')}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={styles.closeIconButton}
              >
                <MaterialCommunityIcons name="close-circle" size={32} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={22} color="#6366F1" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('common.search', 'Search subsectors...')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredSubSectors}
              renderItem={renderSubSectorCard}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="file-search" size={64} color="#D1D5DB" />
                  <Text style={styles.emptyText}>{t('common.noResults', 'No subsectors found')}</Text>
                </View>
              }
            />
            
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeButton}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>{t('common.close', 'Close')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalGdpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  totalGdpInfo: {
    marginLeft: 16,
  },
  totalGdpLabel: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalGdpValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  sectorsContainer: { 
    marginBottom: 24,
  },
  sectorCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  sectorCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sectorInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1,
  },
  sectorIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectorName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1F2937',
    marginBottom: 4,
  },
  sectorSubtext: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectorValues: { 
    alignItems: 'flex-end',
  },
  percentage: { 
    fontSize: 24, 
    fontWeight: '800',
    marginBottom: 4,
  },
  sectorAmount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressBarContainer: { 
    width: '100%', 
    height: 10, 
    backgroundColor: '#F3F4F6', 
    overflow: 'hidden',
  },
  progressBar: { 
    height: '100%',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: { 
    width: '92%', 
    maxHeight: '85%',
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  closeIconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  modalList: {
    paddingBottom: 20,
  },
  subSectorCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  subSectorCardHovered: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  subSectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subSectorInfo: { 
    marginLeft: 16,
    flex: 1,
  },
  subSectorName: { 
    fontSize: 18, 
    color: 'white', 
    fontWeight: '800',
    marginBottom: 4,
  },
  subSectorPercentage: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: 'rgba(255, 255, 255, 0.9)',
  },
  subSectorValue: {
    alignItems: 'flex-start',
  },
  subSectorAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  subSectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  closeButton: { 
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 17, 
    fontWeight: '700',
  },
  footer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6',
  },
  footerText: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginLeft: 8,
    fontWeight: '500',
  },
});