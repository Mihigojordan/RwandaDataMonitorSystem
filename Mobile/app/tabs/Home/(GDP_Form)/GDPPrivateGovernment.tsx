import React, { useState } from 'react'
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

interface PrivateGovernmentData {
  privatePercentage: string;
  governmentPercentage: string;
  importsPercentage: string;
  exportsPercentage: string;
}

const GDP_PrivateGovernment_Form: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<PrivateGovernmentData>({
    privatePercentage: '',
    governmentPercentage: '',
    importsPercentage: '',
    exportsPercentage: ''
  })

  const handleInputChange = (field: keyof PrivateGovernmentData, value: string): void => {
    // Allow only numbers, decimal point, and limit to reasonable percentage values
    let numericValue = value.replace(/[^0-9.]/g, '')
    
    // Prevent multiple decimal points
    const decimalCount = (numericValue.match(/\./g) || []).length
    if (decimalCount > 1) {
      numericValue = numericValue.substring(0, numericValue.lastIndexOf('.'))
    }
    
    // Limit to 2 decimal places
    if (numericValue.includes('.')) {
      const parts = numericValue.split('.')
      if (parts[1] && parts[1].length > 2) {
        numericValue = parts[0] + '.' + parts[1].substring(0, 2)
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  const validateStep1 = (): boolean => {
    const { privatePercentage, governmentPercentage } = formData
    
    if (!privatePercentage || !governmentPercentage) {
      Alert.alert('Validation Error', 'Please enter both Private and Government percentages')
      return false
    }

    const privateValue = Number(privatePercentage)
    const governmentValue = Number(governmentPercentage)

    if (privateValue < 0 || privateValue > 100) {
      Alert.alert('Validation Error', 'Private percentage must be between 0 and 100')
      return false
    }

    if (governmentValue < 0 || governmentValue > 100) {
      Alert.alert('Validation Error', 'Government percentage must be between 0 and 100')
      return false
    }

    if (isNaN(privateValue) || isNaN(governmentValue)) {
      Alert.alert('Validation Error', 'Please enter valid numeric values')
      return false
    }

    return true
  }

  const validateStep2 = (): boolean => {
    const { importsPercentage, exportsPercentage } = formData
    
    if (!importsPercentage || !exportsPercentage) {
      Alert.alert('Validation Error', 'Please enter both Imports and Exports percentages')
      return false
    }

    const importsValue = Number(importsPercentage)
    const exportsValue = Number(exportsPercentage)

    if (importsValue < 0 || importsValue > 100) {
      Alert.alert('Validation Error', 'Imports percentage must be between 0 and 100')
      return false
    }

    if (exportsValue < 0 || exportsValue > 100) {
      Alert.alert('Validation Error', 'Exports percentage must be between 0 and 100')
      return false
    }

    if (isNaN(importsValue) || isNaN(exportsValue)) {
      Alert.alert('Validation Error', 'Please enter valid numeric values')
      return false
    }

    return true
  }

  const validateAllInputs = (): boolean => {
    return validateStep1() && validateStep2()
  }

  const handleNext = (): void => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePrevious = (): void => {
    setCurrentStep(1)
  }

  const handleSubmit = (): void => {
    if (validateAllInputs()) {
      const submitData = {
        privateAndGovernment: {
          private: {
            percentage: Number(formData.privatePercentage)
          },
          government: {
            percentage: Number(formData.governmentPercentage)
          }
        },
        tradeData: {
          imports: {
            percentage: Number(formData.importsPercentage)
          },
          exports: {
            percentage: Number(formData.exportsPercentage)
          }
        },
        timestamp: new Date().toISOString()
      }

      Alert.alert(
        'Success', 
        'GDP Private and Government data has been saved successfully!', 
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('GDP Private & Government Data:', submitData)
              handleReset()
            }
          }
        ]
      )
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
              privatePercentage: '',
              governmentPercentage: '',
              importsPercentage: '',
              exportsPercentage: ''
            })
            setCurrentStep(1)
          }
        }
      ]
    )
  }

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 2</Text>
    </View>
  )

  const renderPercentageInput = (
    label: string,
    icon: string,
    field: keyof PrivateGovernmentData,
    placeholder: string,
    description: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {icon} {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          formData[field] && (Number(formData[field]) < 0 || Number(formData[field]) > 100) 
            ? styles.inputError 
            : styles.inputNormal
        ]}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        maxLength={6}
      />
      <Text style={styles.descriptionText}>{description}</Text>
      {formData[field] && (
        <View style={styles.percentageDisplay}>
          <Text style={[
            styles.percentageValue,
            Number(formData[field]) >= 0 && Number(formData[field]) <= 100 
              ? styles.validPercentage 
              : styles.invalidPercentage
          ]}>
            {formData[field]}%
          </Text>
          {Number(formData[field]) >= 0 && Number(formData[field]) <= 100 ? (
            <Text style={styles.validIcon}>✅</Text>
          ) : (
            <Text style={styles.invalidIcon}>❌</Text>
          )}
        </View>
      )}
    </View>
  )

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🏛️💼 Private vs Government</Text>
      <Text style={styles.stepDescription}>
        Enter the percentage contributions of Private sector and Government sector to GDP
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Independent Percentages</Text>
        <Text style={styles.infoText}>
          Each field represents an independent percentage. They don't need to add up to 100% as they measure different aspects of GDP contribution.
        </Text>
      </View>

      {renderPercentageInput(
        'Private Sector',
        '💼',
        'privatePercentage',
        'Enter private sector percentage',
        'Percentage of GDP contributed by private enterprises and businesses'
      )}

      {renderPercentageInput(
        'Government Sector',
        '🏛️',
        'governmentPercentage',
        'Enter government sector percentage',
        'Percentage of GDP contributed by government spending and public sector'
      )}

      {formData.privatePercentage && formData.governmentPercentage && (
        <View style={styles.step1Summary}>
          <Text style={styles.summaryTitle}>📊 Step 1 Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>💼 Private:</Text>
            <Text style={styles.summaryValue}>{formData.privatePercentage}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🏛️ Government:</Text>
            <Text style={styles.summaryValue}>{formData.governmentPercentage}%</Text>
          </View>
        </View>
      )}
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📦🚢 Trade Data</Text>
      <Text style={styles.stepDescription}>
        Enter the percentage data for Imports and Exports in relation to GDP
      </Text>
      
      {/* Previous Step Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Previous Step Summary:</Text>
        <Text style={styles.summaryText}>💼 Private: {formData.privatePercentage}%</Text>
        <Text style={styles.summaryText}>🏛️ Government: {formData.governmentPercentage}%</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Trade Percentages</Text>
        <Text style={styles.infoText}>
          These percentages represent trade flows as a proportion of GDP. Imports and Exports are independent measurements.
        </Text>
      </View>

      {renderPercentageInput(
        'Imports',
        '📦',
        'importsPercentage',
        'Enter imports percentage',
        'Percentage of GDP represented by imported goods and services'
      )}

      {renderPercentageInput(
        'Exports',
        '🚢',
        'exportsPercentage',
        'Enter exports percentage',
        'Percentage of GDP represented by exported goods and services'
      )}

      {formData.importsPercentage && formData.exportsPercentage && (
        <View style={styles.tradeBalance}>
          <Text style={styles.tradeBalanceTitle}>⚖️ Trade Balance Analysis</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>📦 Imports:</Text>
            <Text style={styles.summaryValue}>{formData.importsPercentage}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🚢 Exports:</Text>
            <Text style={styles.summaryValue}>{formData.exportsPercentage}%</Text>
          </View>
          <View style={styles.balanceLine}>
            <Text style={styles.balanceLabel}>Net Trade Balance:</Text>
            <Text style={[
              styles.balanceValue,
              Number(formData.exportsPercentage) > Number(formData.importsPercentage) 
                ? styles.positiveBalance 
                : styles.negativeBalance
            ]}>
              {Number(formData.exportsPercentage) > Number(formData.importsPercentage) ? '+' : ''}
              {(Number(formData.exportsPercentage) - Number(formData.importsPercentage)).toFixed(2)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  )

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GDP Private & Government</Text>
        <Text style={styles.headerSubtitle}>Multi-step sector and trade analysis</Text>
        {renderProgressBar()}
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {currentStep === 1 ? renderStep1() : renderStep2()}

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
            ) : (
              <>
                <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                  <Text style={styles.previousButtonText}>← Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Save GDP Data</Text>
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
    lineHeight: 24,
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
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 2,
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  inputNormal: {
    borderColor: '#d1d5db',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  descriptionText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic',
  },
  percentageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  percentageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  validPercentage: {
    color: '#059669',
  },
  invalidPercentage: {
    color: '#dc2626',
  },
  validIcon: {
    fontSize: 16,
  },
  invalidIcon: {
    fontSize: 16,
  },
  step1Summary: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
  tradeBalance: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  tradeBalanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  balanceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fcd34d',
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#92400e',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#059669',
  },
  negativeBalance: {
    color: '#dc2626',
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

export default GDP_PrivateGovernment_Form