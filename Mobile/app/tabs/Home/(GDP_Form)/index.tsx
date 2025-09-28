import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const GDP_AddingPage: React.FC = () => {
  const cardData: CardData[] = [
    {
      id: 1,
      title: 'GDP in Billion RWF',
      subtitle:'GDPBillionRwf',
      description: 'Total Gross Domestic Product measured in billions of Rwandan Francs',
      icon: '💰'
    },
    {
      id: 2,
      title: 'GDP Share by Sectors',
      description: 'Breakdown of GDP contribution across different economic sectors',
      subtitle:'GDPSharesBySectors',
      icon: '📊'
    },
    {
      id: 3,
      title: 'GDP Private and Government',
      description: 'Distribution between private sector and government contributions',
      subtitle:'GDPPrivateGovernment',
      icon: '🏛️'
    },
    {
      id: 4,
      title: 'GDP Growth by Sector at Constant Price',
      description: 'Sectoral growth rates adjusted for inflation at constant prices',
      subtitle:'GDPGrowthBySector',
      icon: '📈'
    }
  ]

  const handleCardPress = (cardTitle: string): void => {
   switch (cardTitle) {
    case 'GDPBillionRwf':
      router.push('/tabs/Home/(GDP_Form)/GDPBillionRwf')
      return
    case 'GDPSharesBySectors':
      router.push('/tabs/Home/(GDP_Form)/GDPSharesBySectors')
      return
    case 'GDPPrivateGovernment':
      router.push('/tabs/Home/(GDP_Form)/GDPPrivateGovernment')
      return
    case 'GDPGrowthBySector':
      router.push('/tabs/Home/(GDP_Form)/GDPGrowthBySector')
      return
      
   
    default:
      return ;
   }
  }

  const renderCard = (card: CardData): React.ReactElement => (
    <TouchableOpacity 
      key={card.id} 
      style={styles.card}
      onPress={() => handleCardPress(card.subtitle)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{card.icon}</Text>
        <Text style={styles.cardTitle}>{card.title}</Text>
      </View>
      <Text style={styles.cardDescription}>{card.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.addButton}>+ Add Data</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>GDP Data Management</Text>
        <Text style={styles.pageSubtitle}>Add and manage GDP statistics</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {cardData.map(card => renderCard(card))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#718096',
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    alignItems: 'center',
  },
  addButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3182ce',
  },
})

export default GDP_AddingPage