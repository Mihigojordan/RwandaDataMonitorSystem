import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RwandaSDGPoverty() {
  const { t } = useTranslation();
  const router = useRouter();

  const sdgData = {
    id: 1,
    title: 'NO POVERTY',
    color: '#E5243B',
  };

  const SDGWheel = () => (
    <View style={styles.sdgWheelContainer}>
      <Image
        source={require('../../../Assets/Images/sdg.png')}
        style={styles.sdgWheelImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.reload()}
            style={styles.refreshButton}
          >
            <Icon name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Rwanda SDG: No Poverty</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.mainHeader}>
          <Text style={styles.transformingText}>TRANSFORMING OUR WORLD:</Text>
          <SDGWheel />
          <Text style={styles.agendaTitle}>THE 2030 AGENDA FOR</Text>
          <Text style={styles.agendaSubtitle}>SUSTAINABLE DEVELOPMENT</Text>
        </View>

        <TouchableOpacity 
          style={[styles.sdgCard, { backgroundColor: sdgData.color }]}
          onPress={() => router.push('/tabs/Home/NoPovertyScreen')}
        >
          <View style={styles.sdgContent}>
            <Image
              source={require('../../../Assets/Images/nopoverty.png')}
              style={styles.logo}
              resizeMode="cover"
            />
            <Text style={styles.sdgTitle}>{sdgData.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  logo: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 5,
  },
  refreshButton: {
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  mainHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transformingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  sdgWheelContainer: {
    marginVertical: 20,
  },
  sdgWheelImage: {
    width: 80,
    height: 80,
  },
  agendaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 15,
    letterSpacing: 0.5,
  },
  agendaSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  sdgCard: {
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  sdgContent: {
    padding: 25,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sdgTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});