import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NationalFigures() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const indicators = [
    { id: 'gdp', titleKey: 'grossDomesticProduct', value: '5,798', unit: 'bn RWF', period: '2025 Q2', icon: 'stats-chart', route: 'GDPDetails' },
    { id: 'population', titleKey: 'residentialPopulation', value: '13.2M', unit: 'people', period: '2024 Est.', icon: 'people', route: 'PopulationDetails' },
    { id: 'cpi', titleKey: 'consumerPriceIndex', value: '102.1', unit: 'index points', period: '2025 Q2', icon: 'cart', route: 'CPIDetails' },
    { id: 'employment', titleKey: 'employeeToPopulationRatio', value: '83.2%', unit: 'ratio', period: '2024', icon: 'briefcase', route: 'EmploymentDetails' },
  ];

  const filteredIndicators = indicators.filter(indicator =>
    t(indicator.titleKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIndicatorPress = (indicator) => {
    router.push(`/tabs/Home/${indicator.route}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
          <Text style={styles.backText}>{t('back')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Logo and Title */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image
              source={require('../../../Assets/Images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.title}>{t('nationalFigures')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Indicators List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.indicatorsList}>
          {filteredIndicators.map((indicator, index) => (
            <TouchableOpacity
              key={indicator.id}
              style={[
                styles.indicatorCard,
                { backgroundColor: index === 0 ? '#005cab' : '#fdfdfd' }
              ]}
              onPress={() => handleIndicatorPress(indicator)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: index === 0 ? 'rgba(255, 255, 255, 0.3)' : '#E3F2FD' }
                ]}>
                  <Ionicons 
                    name={indicator.icon} 
                    size={48} 
                    color={index === 0 ? "white" : "#005CAB"} 
                  />
                </View>
                
                <Text style={[
                  styles.indicatorTitle,
                  { color: index === 0 ? "white" : "#000" }
                ]}>
                  {t(indicator.titleKey)}
                </Text>
                
                <Text style={[
                  styles.indicatorValue,
                  { color: index === 0 ? "white" : "#005CAB" }
                ]}>
                  {indicator.value}
                </Text>
                
                <Text style={[
                  styles.indicatorPeriod,
                  { color: index === 0 ? "rgba(255, 255, 255, 0.9)" : "#005CAB" }
                ]}>
                  {indicator.period}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#333', fontSize: 16, fontWeight: '500', marginLeft: 5 },
  refreshButton: { padding: 5 },
  logoSection: { alignItems: 'center', paddingVertical: 10 },
  logoContainer: { marginBottom: 10 },
  logo: { width: 200, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1976D2', letterSpacing: 0.5 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  content: { flex: 1, paddingHorizontal: 20 },
  indicatorsList: { paddingBottom: 20 },
  indicatorCard: { width: '100%', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 4 },
  cardContent: { alignItems: 'center', justifyContent: 'center' },
  iconContainer: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  indicatorTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', lineHeight: 26 },
  indicatorValue: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  indicatorPeriod: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});