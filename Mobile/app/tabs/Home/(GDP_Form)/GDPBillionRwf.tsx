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
  Platform,
  Animated 
} from 'react-native'

interface GDPData {
  lastYear: string;
  lastYearQuarter: string;
  lastYearAmount: string;
  nextYear: string;
  nextYearQuarter: string;
  nextYearAmount: string;
}

const GDP_BillionRWF_Form: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<GDPData>({
    lastYear: '',
    lastYearQuarter: '',
    lastYearAmount: '',
    nextYear: '',
    nextYearQuarter: '',
    nextYearAmount: ''
  })

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

  const handleInputChange = (field: keyof GDPData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuarterSelect = (field: 'lastYearQuarter' | 'nextYearQuarter', quarter: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: quarter
    }))
  }

  const validateStep1 = (): boolean => {
    const { lastYear, lastYearQuarter, lastYearAmount } = formData
    
    if (!lastYear || !lastYearQuarter || !lastYearAmount) {
      Alert.alert('Validation Error', 'Please fill in all fields for the previous year')
      return false
    }

    if (isNaN(Number(lastYear)) || Number(lastYear) < 1900 || Number(lastYear) > 2100) {
      Alert.alert('Validation Error', 'Please enter a valid year')
      return false
    }

    if (isNaN(Number(lastYearAmount)) || Number(lastYearAmount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than 0')
      return false
    }

    return true
  }

  const validateStep2 = (): boolean => {
    const { nextYear, nextYearQuarter, nextYearAmount } = formData
    
    if (!nextYear || !nextYearQuarter || !nextYearAmount) {
      Alert.alert('Validation Error', 'Please fill in all fields for the current/next year')
      return false
    }

    if (isNaN(Number(nextYear)) || Number(nextYear) < 1900 || Number(nextYear) > 2100) {
      Alert.alert('Validation Error', 'Please enter a valid year')
      return false
    }

    if (isNaN(Number(nextYearAmount)) || Number(nextYearAmount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than 0')
      return false
    }

    if (Number(nextYear) <= Number(formData.lastYear)) {
      Alert.alert('Validation Error', 'Current/Next year should be after the previous year')
      return false
    }

    return true
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
    if (validateStep2()) {
      Alert.alert('Success', 'GDP data has been saved successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            console.log('GDP Data:', formData)
            // Reset form and go back to step 1
            setFormData({
              lastYear: '',
              lastYearQuarter: '',
              lastYearAmount: '',
              nextYear: '',
              nextYearQuarter: '',
              nextYearAmount: ''
            })
            setCurrentStep(1)
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
              lastYear: '',
              lastYearQuarter: '',
              lastYearAmount: '',
              nextYear: '',
              nextYearQuarter: '',
              nextYearAmount: ''
            })
            setCurrentStep(1)
          }
        }
      ]
    )
  }

  const renderQuarterButtons = (selectedQuarter: string, onSelect: (quarter: string) => void) => (
    <View style={styles.quarterContainer}>
      {quarters.map((quarter) => (
        <TouchableOpacity
          key={quarter}
          style={[
            styles.quarterButton,
            selectedQuarter === quarter && styles.quarterButtonSelected
          ]}
          onPress={() => onSelect(quarter)}
        >
          <Text style={[
            styles.quarterButtonText,
            selectedQuarter === quarter && styles.quarterButtonTextSelected
          ]}>
            {quarter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 2</Text>
    </View>
  )

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📊 Previous Year GDP Data</Text>
      <Text style={styles.stepDescription}>Enter the GDP data for the previous year</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={formData.lastYear}
          onChangeText={(value) => handleInputChange('lastYear', value)}
          placeholder="Enter year (e.g., 2023)"
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quarter</Text>
        {renderQuarterButtons(
          formData.lastYearQuarter, 
          (quarter) => handleQuarterSelect('lastYearQuarter', quarter)
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (Billion RWF)</Text>
        <TextInput
          style={styles.input}
          value={formData.lastYearAmount}
          onChangeText={(value) => handleInputChange('lastYearAmount', value)}
          placeholder="Enter amount in billions"
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📈 Current/Next Year GDP Data</Text>
      <Text style={styles.stepDescription}>Enter the GDP data for the current or next year</Text>
      
      {/* Summary of previous step */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Previous Year Summary:</Text>
        <Text style={styles.summaryText}>
          {formData.lastYear} {formData.lastYearQuarter}: {formData.lastYearAmount} Billion RWF
        </Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={formData.nextYear}
          onChangeText={(value) => handleInputChange('nextYear', value)}
          placeholder="Enter year (e.g., 2024)"
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quarter</Text>
        {renderQuarterButtons(
          formData.nextYearQuarter, 
          (quarter) => handleQuarterSelect('nextYearQuarter', quarter)
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (Billion RWF)</Text>
        <TextInput
          style={styles.input}
          value={formData.nextYearAmount}
          onChangeText={(value) => handleInputChange('nextYearAmount', value)}
          placeholder="Enter amount in billions"
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GDP in Billion RWF</Text>
        <Text style={styles.headerSubtitle}>Multi-step GDP data entry</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
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
    fontSize: 15,
    color: '#1e40af',
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
  quarterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quarterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  quarterButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  quarterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  quarterButtonTextSelected: {
    color: '#ffffff',
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

export default GDP_BillionRWF_Form