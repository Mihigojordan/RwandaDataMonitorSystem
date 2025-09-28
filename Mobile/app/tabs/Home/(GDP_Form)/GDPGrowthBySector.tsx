import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform 
} from 'react-native'

interface SubCategory {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  description: string;
}

interface SectorData {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  subCategories: SubCategory[];
}

const GDP_GrowthBySector_Screen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null)
  const [sectorPercentage, setSectorPercentage] = useState('')
  const [subCategoryPercentages, setSubCategoryPercentages] = useState<{[key: string]: string}>({})

  const serviceSubCategories: SubCategory[] = [
    { name: 'Trade', percentage: 19, color: '#1E3A8A', icon: '🛒', description: 'Wholesale and retail trade services' },
    { name: 'Transport', percentage: 14, color: '#1E40AF', icon: '🚌', description: 'Transportation and logistics services' },
    { name: 'Government', percentage: 16, color: '#1E293B', icon: '🏛️', description: 'Public administration services' },
    { name: 'Financial Services', percentage: 8, color: '#0F172A', icon: '💰', description: 'Banking and financial institutions' },
    { name: 'Hotels & Restaurants', percentage: 5, color: '#312E81', icon: '🍽️', description: 'Hospitality and food services' },
    { name: 'Health', percentage: 4, color: '#1E3A8A', icon: '🏥', description: 'Healthcare and medical services' },
    { name: 'Education', percentage: 5, color: '#1E40AF', icon: '🏫', description: 'Educational services and institutions' },
    { name: 'ICT', percentage: 6, color: '#0F172A', icon: '💻', description: 'Information and communication technology' },
    { name: 'Real Estate', percentage: 7, color: '#312E81', icon: '🏠', description: 'Real estate and property services' },
  ]

  const agricultureSubCategories: SubCategory[] = [
    { name: 'Livestock & Products', percentage: 8, color: '#10B981', icon: '🐄', description: 'Cattle, poultry, and dairy production' },
    { name: 'Forestry', percentage: 6, color: '#059669', icon: '🌳', description: 'Forest products and timber' },
    { name: 'Export Crops', percentage: 3, color: '#047857', icon: '📦', description: 'Coffee, tea, and other export crops' },
    { name: 'Food Crops', percentage: 4, color: '#065F46', icon: '🌾', description: 'Staple food crop production' },
    { name: 'Fisheries', percentage: 2, color: '#064E3B', icon: '🎣', description: 'Fish farming and aquaculture' },
    { name: 'Horticulture', percentage: 1, color: '#0F766E', icon: '🌺', description: 'Fruits and vegetable production' },
  ]

  const industrySubCategories: SubCategory[] = [
    { name: 'Manufacturing', percentage: 16, color: '#3B82F6', icon: '🏭', description: 'Industrial manufacturing' },
    { name: 'Construction', percentage: 13, color: '#2563EB', icon: '🏗️', description: 'Building and infrastructure' },
    { name: 'Mining', percentage: 8, color: '#1D4ED8', icon: '⛏️', description: 'Mineral extraction and processing' },
    { name: 'Food Processing', percentage: 2, color: '#1E40AF', icon: '🥫', description: 'Food and beverage processing' },
    { name: 'Textiles', percentage: 3, color: '#1E3A8A', icon: '👕', description: 'Textile and clothing manufacturing' },
    { name: 'Energy', percentage: 5, color: '#172554', icon: '⚡', description: 'Power generation and distribution' },
  ]

  const [sectors, setSectors] = useState<SectorData[]>([
    {
      name: 'Services',
      percentage: 84,
      color: '#1E40AF',
      icon: '🏢',
      subCategories: serviceSubCategories
    },
    {
      name: 'Agriculture',
      percentage: 24,
      color: '#10B981',
      icon: '🌾',
      subCategories: agricultureSubCategories
    },
    {
      name: 'Industry',
      percentage: 47,
      color: '#3B82F6',
      icon: '🏭',
      subCategories: industrySubCategories
    }
  ])

  const handleSectorPress = (sector: SectorData): void => {
    setSelectedSector(sector)
    setSectorPercentage(sector.percentage.toString())
    
    // Initialize subcategory percentages
    const subCatPercentages: {[key: string]: string} = {}
    sector.subCategories.forEach(subCat => {
      subCatPercentages[subCat.name] = subCat.percentage.toString()
    })
    setSubCategoryPercentages(subCatPercentages)
    
    setModalVisible(true)
  }

  const handleInputChange = (value: string): void => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    setSectorPercentage(numericValue)
  }

  const handleSubCategoryChange = (subCatName: string, value: string): void => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    setSubCategoryPercentages(prev => ({
      ...prev,
      [subCatName]: numericValue
    }))
  }

  const validateAndSave = (): void => {
    if (!selectedSector) return

    // Validate main percentage
    const mainPercent = Number(sectorPercentage)
    if (!sectorPercentage || mainPercent < 0 || mainPercent > 100) {
      Alert.alert('Validation Error', 'Please enter a valid percentage between 0 and 100 for the main sector')
      return
    }

    // Validate subcategories
    let hasError = false
    const updatedSubCategories = selectedSector.subCategories.map(subCat => {
      const percentValue = Number(subCategoryPercentages[subCat.name] || '0')
      if (percentValue < 0 || percentValue > 100) {
        hasError = true
        return subCat
      }
      return {
        ...subCat,
        percentage: percentValue
      }
    })

    if (hasError) {
      Alert.alert('Validation Error', 'All subcategory percentages must be between 0 and 100')
      return
    }

    // Update the sector data
    setSectors(prevSectors => 
      prevSectors.map(sector => 
        sector.name === selectedSector.name 
          ? {
              ...sector,
              percentage: mainPercent,
              subCategories: updatedSubCategories
            }
          : sector
      )
    )

    Alert.alert('Success', `${selectedSector.name} sector data has been updated successfully!`)
    setModalVisible(false)
  }

  const resetSector = (): void => {
    if (!selectedSector) return
    
    Alert.alert(
      'Reset Sector',
      `Are you sure you want to reset ${selectedSector.name} sector to default values?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSectorPercentage(selectedSector.percentage.toString())
            const defaultPercentages: {[key: string]: string} = {}
            selectedSector.subCategories.forEach(subCat => {
              defaultPercentages[subCat.name] = subCat.percentage.toString()
            })
            setSubCategoryPercentages(defaultPercentages)
          }
        }
      ]
    )
  }

  const renderProgressBar = (percentage: number, color: string): React.ReactElement => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(percentage, 100)}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: color }]}>{percentage}%</Text>
    </View>
  )

  const renderSectorCard = (sector: SectorData): React.ReactElement => (
    <TouchableOpacity
      key={sector.name}
      style={[styles.sectorCard, { borderLeftColor: sector.color }]}
      onPress={() => handleSectorPress(sector)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.sectorIcon}>{sector.icon}</Text>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.sectorTitle}>{sector.name}</Text>
          <Text style={styles.subCategoryCount}>
            {sector.subCategories.length} subcategories
          </Text>
        </View>
      </View>
      
      {renderProgressBar(sector.percentage, sector.color)}
      
      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>Tap to edit percentages</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  )

  const renderSubCategoryInput = (subCategory: SubCategory): React.ReactElement => (
    <View key={subCategory.name} style={styles.subCategoryItem}>
      <View style={styles.subCategoryHeader}>
        <Text style={styles.subCategoryIcon}>{subCategory.icon}</Text>
        <View style={styles.subCategoryInfo}>
          <Text style={styles.subCategoryName}>{subCategory.name}</Text>
          <Text style={styles.subCategoryDescription}>{subCategory.description}</Text>
        </View>
      </View>
      
      <View style={styles.subCategoryInputContainer}>
        <TextInput
          style={[
            styles.subCategoryInput,
            {
              borderColor: 
                Number(subCategoryPercentages[subCategory.name] || '0') >= 0 && 
                Number(subCategoryPercentages[subCategory.name] || '0') <= 100 
                  ? '#d1d5db' 
                  : '#dc2626'
            }
          ]}
          value={subCategoryPercentages[subCategory.name] || ''}
          onChangeText={(value) => handleSubCategoryChange(subCategory.name, value)}
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={6}
        />
        <Text style={styles.percentSymbol}>%</Text>
      </View>
      
      {subCategoryPercentages[subCategory.name] && (
        <View style={styles.subCategoryProgress}>
          {renderProgressBar(Number(subCategoryPercentages[subCategory.name]), subCategory.color)}
        </View>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GDP Growth by Sector</Text>
        <Text style={styles.headerSubtitle}>Track sectoral growth percentages</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {sectors.map(sector => renderSectorCard(sector))}
        </View>
      </ScrollView>

      {/* Modal for editing sector */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedSector?.icon} {selectedSector?.name} Sector
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetSector}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollContainer}>
            <View style={styles.modalContent}>
              {/* Main sector percentage input */}
              <View style={styles.mainSectorSection}>
                <Text style={styles.sectionTitle}>Overall Sector Percentage</Text>
                <View style={styles.mainInputContainer}>
                  <TextInput
                    style={styles.mainInput}
                    value={sectorPercentage}
                    onChangeText={handleInputChange}
                    placeholder="Enter percentage"
                    keyboardType="decimal-pad"
                    maxLength={6}
                  />
                  <Text style={styles.percentSymbol}>%</Text>
                </View>
                {sectorPercentage && (
                  <View style={styles.mainProgressContainer}>
                    {renderProgressBar(Number(sectorPercentage), selectedSector?.color || '#3B82F6')}
                  </View>
                )}
              </View>

              {/* Subcategories */}
              <View style={styles.subCategoriesSection}>
                <Text style={styles.sectionTitle}>Subcategories</Text>
                <Text style={styles.sectionSubtitle}>
                  Enter percentage for each subcategory within this sector
                </Text>
                
                {selectedSector?.subCategories.map(subCategory => 
                  renderSubCategoryInput(subCategory)
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
  },
  scrollContainer: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
  sectorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectorIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  sectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subCategoryCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cardFooterText: {
    fontSize: 14,
    color: '#6b7280',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  modalScrollContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  mainSectorSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  mainInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  percentSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 12,
  },
  mainProgressContainer: {
    marginTop: 8,
  },
  subCategoriesSection: {
    marginBottom: 20,
  },
  subCategoryItem: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  subCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subCategoryIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  subCategoryInfo: {
    flex: 1,
  },
  subCategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subCategoryDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  subCategoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subCategoryInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  subCategoryProgress: {
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
})

export default GDP_GrowthBySector_Screen