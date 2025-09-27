// HomeMain.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeMain() {
  const { t, i18n } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const textAnimValue = useRef(new Animated.Value(0)).current;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Continuous text animation
    const animateText = () => {
      Animated.sequence([
        Animated.timing(textAnimValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ]).start(() => animateText());
    };
    animateText();
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageModalVisible(false);
  };

  const toggleLanguageModal = () => {
    setLanguageModalVisible(!languageModalVisible);
  };

  const openRegistrationLink = () => {
    Linking.openURL('https://www.statistics.gov.rw/');
  };

  const navigateToNationalFigures = () => {
    router.push('/tabs/Home/NationalFigures');
  };

  const navigateToRwandaSDGs = () => {
    router.push('/tabs/Home/RwandaSDGs');
  };

  const textOpacity = textAnimValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7]
  });

  const textScale = textAnimValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1]
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor="#005CAB" barStyle="light-content" />
      
      {/* Gradient Header Section */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#005CAB', '#0067D6', '#1976D2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <View style={styles.overlay} />
          
          {/* Language Selector */}
          <View style={styles.languageContainer}>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={toggleLanguageModal}
            >
              <Text style={styles.languageLabel}>{t('language')}: {i18n.language.toUpperCase()}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Image
              source={require('../../../Assets/Images/logo1.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Animated Advertisement Section */}
      <View style={styles.advertisementContainer}>
        <LinearGradient
          colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.advertisementGradient}
        >
          <View style={styles.advertisementContent}>
            <Animated.View style={[
              styles.advertisementTextContainer,
              {
                opacity: textOpacity,
                transform: [{ scale: textScale }]
              }
            ]}>
              <Text style={styles.bigDataText}>{t('bigData')}</Text>
              <Text style={styles.hackathonTitle}>{t('hackathonInfograhic')}</Text>
              <Text style={styles.competitionText}>{t('competitions')}</Text>
            </Animated.View>
            
            <TouchableOpacity style={styles.registerButton} onPress={openRegistrationLink}>
              <Text style={styles.registerButtonText}>{t('clickToRegisterNow')}</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </LinearGradient>
      </View>

      {/* Navigation Cards Section */}
      <View style={styles.cardsSection}>
    
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={navigateToNationalFigures}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1976D2', '#1565C0', '#0D47A1']}
              style={styles.cardGradient}
            >
              <View style={styles.cardIcon}>
                <View style={styles.iconContainer}>
                  {/* Statistics Icon SVG equivalent */}
                  <View style={styles.statisticsIcon}>
                    <View style={[styles.bar, styles.bar1]} />
                    <View style={[styles.bar, styles.bar2]} />
                    <View style={[styles.bar, styles.bar3]} />
                    <View style={[styles.bar, styles.bar4]} />
                  </View>
                </View>
              </View>
              <Text style={styles.cardTitle}>{t('nationalFigures')}</Text>
              <View style={styles.cardArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={navigateToRwandaSDGs}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1976D2', '#1565C0', '#0D47A1']}
              style={styles.cardGradient}
            >
              <View style={styles.cardIcon}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../../Assets/Images/sdg.png')}
                    style={styles.sdgIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.cardTitle}>{t('rwandaSDGs')}</Text>
              <View style={styles.cardArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />

      {/* Language Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1976D2', '#1565C0']}
              style={styles.modalGradient}
            >
              <TouchableOpacity
                style={[styles.langOption, i18n.language === 'en' && styles.activeLangOption]}
                onPress={() => changeLanguage('en')}
              >
                <Text style={[styles.langOptionText, i18n.language === 'en' && styles.activeLangOptionText]}>
                  English
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.langOption, i18n.language === 'fr' && styles.activeLangOption]}
                onPress={() => changeLanguage('fr')}
              >
                <Text style={[styles.langOptionText, i18n.language === 'fr' && styles.activeLangOptionText]}>
                  Français
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.langOption, i18n.language === 'rw' && styles.activeLangOption]}
                onPress={() => changeLanguage('rw')}
              >
                <Text style={[styles.langOptionText, i18n.language === 'rw' && styles.activeLangOptionText]}>
                  Kinyarwanda
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    height: 200,
  },
  gradientHeader: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 103, 214, 0.1)',
  },
  languageContainer: {
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: -10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical:20,

    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'flex-end',
  },
  languageLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  dropdownArrow: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 10,
  },
  logo: {
    width: 180,
    height: 120,
    zIndex: 2,
  },
  
  // Advertisement Section
  advertisementContainer: {
    height: 200,
    margin: 0,
  },
  advertisementGradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  advertisementContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 10,
  },
  advertisementTextContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  bigDataText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1976D2',
    marginBottom: 8,
    // textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  hackathonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    textAlign: 'center',
    lineHeight: 26,
    // textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  competitionText: {
    fontSize: 16,
    color: '#1565C0',
    fontStyle: 'italic',
    marginTop: 4,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Decorative Elements
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
  },
  
  // Cards Section
  cardsSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 5,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 25,
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIcon: {
    marginRight: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconText: {
    fontSize: 28,
  },
  statisticsIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 30,
    height: 24,
  },
  bar: {
    backgroundColor: 'white',
    width: 4,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  bar1: {
    height: 8,
  },
  bar2: {
    height: 16,
  },
  bar3: {
    height: 12,
  },
  bar4: {
    height: 20,
  },
  sdgIcon: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
    lineHeight: 24,
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 30,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalGradient: {
    padding: 0,
  },
  langOption: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  activeLangOption: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  langOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeLangOptionText: {
    fontWeight: '800',
  },
});