// GDPGrowthSectors.js - React Native version
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export function GDPGrowthSectors() {
  const growthData = [
    { sector: 'Information Technology', growth: 15.2, color: '#8B5CF6' },
    { sector: 'Financial Services', growth: 12.8, color: '#06B6D4' },
    { sector: 'Manufacturing', growth: 8.5, color: '#F59E0B' },
    { sector: 'Tourism & Hospitality', growth: 7.3, color: '#EF4444' },
    { sector: 'Agriculture', growth: 5.1, color: '#10B981' },
    { sector: 'Mining', growth: 3.2, color: '#6B7280' },
  ];

  return (
    <View style={growthStyles.container}>
      <View style={growthStyles.header}>
        <Text style={growthStyles.title}>GDP Growth by Sectors</Text>
        <Text style={growthStyles.subtitle}>Annual Growth Rate (%)</Text>
      </View>

      <View style={growthStyles.chartContainer}>
        {growthData.map((item, index) => (
          <View key={item.sector} style={growthStyles.barContainer}>
            <View style={growthStyles.labelContainer}>
              <Text style={growthStyles.sectorLabel}>{item.sector}</Text>
              <Text style={[growthStyles.growthValue, { color: item.color }]}>
                {item.growth}%
              </Text>
            </View>
            <View style={growthStyles.barTrack}>
              <View
                style={[
                  growthStyles.barFill,
                  {
                    backgroundColor: item.color,
                    width: `${(item.growth / 16) * 100}%`, // Scale to 16% max
                  }
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={growthStyles.footer}>
        <Text style={growthStyles.footerText}>
          Data shows year-over-year growth rates
        </Text>
        <Text style={growthStyles.footerText}>
          Q1 2024 • Ministry of Finance and Economic Planning
        </Text>
      </View>
    </View>
  );
}

const growthStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
  },
  barContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  growthValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default GDPGrowthSectors;