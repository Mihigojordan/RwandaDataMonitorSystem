import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native'

interface SectorData {
  totalGDP: string;
  servicePercentage: string;
  agriculturePercentage: string;
  taxPercentage: string;
  industryPercentage: string;
}

interface SectorCalculation {
  service: number;
  agriculture: number;
  tax: number;
  industry: number;
  total: number;
}

const GDP_SharesBySectors_Form: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<SectorData>({
    totalGDP: '',
    servicePercentage: '',
    agriculturePercentage: '',
    taxPercentage: '',
    industryPercentage: ''
  })

  const [calculations, setCalculations] = useState<SectorCalculation>({
    service: 0,
    agriculture: 0,
    tax: 0,
    industry: 0,
    total: 0
  })

  const [totalPercentage, setTotalPercentage] = useState<number>(0)

  // Calculate values and percentages whenever form data changes
  useEffect(() => {
    const gdp = Number(formData.totalGDP) || 0
    const servicePercent = Number(formData.servicePercentage) || 0
    const agriculturePercent = Number(formData.agriculturePercentage) || 0
    const taxPercent = Number(formData.taxPercentage) || 0
    const industryPercent = Number(formData.industryPercentage) || 0

    const newCalculations = {
      service: (gdp * servicePercent) / 100,
      agriculture: (gdp * agriculturePercent) / 100,
      tax: (gdp * taxPercent) / 100,
      industry: (gdp * industryPercent) / 100,
      total: servicePercent + agriculturePercent + taxPercent + industryPercent
    }

    setCalculations(newCalculations)
    setTotalPercentage(newCalculations.total)
  }, [formData])

  const handleInputChange = (field: keyof SectorData, value: string): void => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  const validateStep1 = (): boolean => {
    if (!formData.totalGDP) {
      Alert.alert('Validation Error', 'Please enter the total GDP')
      return false
    }

    if (Number(formData.totalGDP) <= 0) {
      Alert.alert('Validation Error', 'Total GDP must be greater than 0')
      return false
    }

    return true
  }

  const validateStep2 = (): boolean => {
    const { servicePercentage, agriculturePercentage } = formData
    
    if (!servicePercentage || !agriculturePercentage) {
      Alert.alert('Validation Error', 'Please enter both Services and Agriculture percentages')
      return false
    }

    const serviceValue = Number(servicePercentage)
    const agricultureValue = Number(agriculturePercentage)

    if (serviceValue < 0 || serviceValue > 100 || agricultureValue < 0 || agricultureValue > 100) {
      Alert.alert('Validation Error', 'Percentages must be between 0 and 100')
      return false
    }

    if (serviceValue + agricultureValue > 100) {
      Alert.alert('Validation Error', 'Services and Agriculture percentages cannot exceed 100% combined')
      return false
    }

    return true
  }

  const validateStep3 = (): boolean => {
    const { taxPercentage, industryPercentage } = formData
    
    if (!taxPercentage || !industryPercentage) {
      Alert.alert('Validation Error', 'Please enter both Tax and Industry percentages')
      return false
    }

    const taxValue = Number(taxPercentage)
    const industryValue = Number(industryPercentage)

    if (taxValue < 0 || taxValue > 100 || industryValue < 0 || industryValue > 100) {
      Alert.alert('Validation Error', 'Percentages must be between 0 and 100')
      return false
    }

    // Check if total percentage is exactly 100%
    if (Math.abs(totalPercentage - 100) > 0.01) {
      Alert.alert(
        'Validation Error', 
        `Total percentage is ${totalPercentage.toFixed(2)}%. It must equal exactly 100%`
      )
      return false
    }

    return true
  }

  const handleNext = (): void => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handlePrevious = (): void => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = (): void => {
    if (validateStep3()) {
      const submitData = {
        totalGDP: Number(formData.totalGDP),
        sectors: {
          service: {
            percentage: Number(formData.servicePercentage),
            value: calculations.service
          },
          agriculture: {
            percentage: Number(formData.agriculturePercentage),
            value: calculations.agriculture
          },
          tax: {
            percentage: Number(formData.taxPercentage),
            value: calculations.tax
          },
          industry: {
            percentage: Number(formData.industryPercentage),
            value: calculations.industry
          }
        },
        totalPercentage: totalPercentage
      }

      Alert.alert('Success', 'GDP Shares by Sectors data has been saved successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            console.log('GDP Shares Data:', submitData)
            handleReset()
          }
        }
      ])
    }
  }

  const handleReset = (): void => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to reset all data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setFormData({
              totalGDP: '',
              servicePercentage: '',
              agriculturePercentage: '',
              taxPercentage: '',
              industryPercentage: ''
            })
            setCurrentStep(1)
          }
        }
      ]
    )
  }

  const autoCalculateRemaining = (): void => {
    const currentTotal = Number(formData.servicePercentage || 0) + 
                        Number(formData.agriculturePercentage || 0) + 
                        Number(formData.taxPercentage || 0)
    
    const remaining = Math.max(0, 100 - currentTotal)
    
    setFormData(prev => ({
      ...prev,
      industryPercentage: remaining.toString()
    }))
  }

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 3</Text>
    </View>
  )

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>💰 Total GDP Input</Text>
      <Text style={styles.stepDescription}>Enter the total GDP amount that will be distributed across sectors</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>🏦 Total GDP (Billion RWF)</Text>
        <TextInput
          style={styles.input}
          value={formData.totalGDP}
          onChangeText={(value) => handleInputChange('totalGDP', value)}
          placeholder="Enter total GDP in billions"
          keyboardType="decimal-pad"
          maxLength={15}
        />
        {formData.totalGDP && (
          <Text style={styles.helperText}>
            Total GDP: {Number(formData.totalGDP).toLocaleString()} Billion RWF
          </Text>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Next Steps</Text>
        <Text style={styles.infoText}>
          After entering the total GDP, you'll distribute it across four main sectors: Services, Agriculture, Tax, and Industry.
        </Text>
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🏢🌾 Primary Sectors</Text>
      <Text style={styles.stepDescription}>Enter percentages for Services and Agriculture sectors</Text>
      
      {/* GDP Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Total GDP: {Number(formData.totalGDP).toLocaleString()} Billion RWF</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>🏢 Services (%)</Text>
        <TextInput
          style={styles.input}
          value={formData.servicePercentage}
          onChangeText={(value) => handleInputChange('servicePercentage', value)}
          placeholder="Enter services percentage"
          keyboardType="decimal-pad"
          maxLength={6}
        />
        {formData.servicePercentage && Number(formData.totalGDP) > 0 && (
          <Text style={styles.calculatedValue}>
            = {((Number(formData.totalGDP) * Number(formData.servicePercentage)) / 100).toLocaleString()} Billion RWF
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>🌾 Agriculture (%)</Text>
        <TextInput
          style={styles.input}
          value={formData.agriculturePercentage}
          onChangeText={(value) => handleInputChange('agriculturePercentage', value)}
          placeholder="Enter agriculture percentage"
          keyboardType="decimal-pad"
          maxLength={6}
        />
        {formData.agriculturePercentage && Number(formData.totalGDP) > 0 && (
          <Text style={styles.calculatedValue}>
            = {((Number(formData.totalGDP) * Number(formData.agriculturePercentage)) / 100).toLocaleString()} Billion RWF
          </Text>
        )}
      </View>

      {(formData.servicePercentage || formData.agriculturePercentage) && (
        <View style={styles.stepSummary}>
          <Text style={styles.stepSummaryTitle}>Current Total: {(Number(formData.servicePercentage || 0) + Number(formData.agriculturePercentage || 0)).toFixed(2)}%</Text>
          <Text style={styles.stepSummaryText}>
            Remaining: {(100 - (Number(formData.servicePercentage || 0) + Number(formData.agriculturePercentage || 0))).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>💸🏭 Remaining Sectors</Text>
      <Text style={styles.stepDescription}>Complete the distribution with Tax and Industry sectors</Text>
      
      {/* Previous Steps Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Previous Allocations:</Text>
        <Text style={styles.summaryText}>🏢 Services: {formData.servicePercentage}%</Text>
        <Text style={styles.summaryText}>🌾 Agriculture: {formData.agriculturePercentage}%</Text>
        <Text style={styles.summaryText}>
          Remaining to allocate: {(100 - Number(formData.servicePercentage || 0) - Number(formData.agriculturePercentage || 0)).toFixed(2)}%
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>💸 Tax (%)</Text>
        <TextInput
          style={styles.input}
          value={formData.taxPercentage}
          onChangeText={(value) => handleInputChange('taxPercentage', value)}
          placeholder="Enter tax percentage"
          keyboardType="decimal-pad"
          maxLength={6}
        />
        {formData.taxPercentage && Number(formData.totalGDP) > 0 && (
          <Text style={styles.calculatedValue}>
            = {((Number(formData.totalGDP) * Number(formData.taxPercentage)) / 100).toLocaleString()} Billion RWF
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>🏭 Industry (%)</Text>
        <TextInput
          style={styles.input}
          value={formData.industryPercentage}
          onChangeText={(value) => handleInputChange('industryPercentage', value)}
          placeholder="Enter industry percentage"
          keyboardType="decimal-pad"
          maxLength={6}
        />
        {formData.industryPercentage && Number(formData.totalGDP) > 0 && (
          <Text style={styles.calculatedValue}>
            = {((Number(formData.totalGDP) * Number(formData.industryPercentage)) / 100).toLocaleString()} Billion RWF
          </Text>
        )}
      </View>

      {/* Auto Calculate Button */}
      <TouchableOpacity style={styles.autoCalculateButton} onPress={autoCalculateRemaining}>
        <Text style={styles.autoCalculateText}>Auto-Calculate Industry %</Text>
      </TouchableOpacity>

      {/* Final Summary */}
      <View style={[styles.finalSummary, { backgroundColor: totalPercentage === 100 ? '#f0fdf4' : '#fef3c7' }]}>
        <Text style={styles.finalSummaryTitle}>
          Total Percentage: 
          <Text style={[styles.totalPercentageText, { color: totalPercentage === 100 ? '#059669' : '#d97706' }]}>
            {' '}{totalPercentage.toFixed(2)}%
          </Text>
        </Text>
        
        {totalPercentage === 100 ? (
          <Text style={styles.successText}>✅ Perfect! Ready to submit</Text>
        ) : (
          <Text style={styles.warningText}>
            ⚠️ {totalPercentage > 100 ? 'Exceeds 100%' : 'Must equal 100%'}
          </Text>
        )}
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GDP Shares by Sectors</Text>
        <Text style={styles.headerSubtitle}>Multi-step sector distribution</Text>
        {renderProgressBar()}
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep === 1 ? (
              <>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next Step →</Text>
                </TouchableOpacity>
              </>
            ) : currentStep === 2 ? (
              <>
                <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                  <Text style={styles.previousButtonText}>← Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next Step →</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                  <Text style={styles.previousButtonText}>← Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Save Sector Data</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  calculatedValue: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  stepSummary: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  stepSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  stepSummaryText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  autoCalculateButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  autoCalculateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  finalSummary: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  finalSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  totalPercentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  warningText: {
    fontSize: 14,
    color: '#d97706',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  previousButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6b7280',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})

export default GDP_SharesBySectors_Form