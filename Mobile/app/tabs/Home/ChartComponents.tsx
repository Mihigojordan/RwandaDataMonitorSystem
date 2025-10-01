import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export const CustomPieChart = ({ data, onSectorPress, totalGDP, setClickedSectorData, setPieModalVisible, getSubSectors, sectors }) => {
  const handlePieChartClick = (data, index) => {
    const clickedSector = sectors.find(sector => sector.name === data.name);
    if (clickedSector) {
      setClickedSectorData({
        ...clickedSector,
        subSectors: getSubSectors(clickedSector.name),
        totalValue: ((clickedSector.percentage / 100) * totalGDP).toFixed(0)
      });
      setPieModalVisible(true);
    }
  };

  return (
    <View style={styles.pieChartContainer}>
      <PieChart
        data={data}
        width={width - 32}
        height={250}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
        hasLegend={false}
        onDataPointClick={(data, index) => {
          handlePieChartClick(data, index);
        }}
      />
      <View style={styles.pieChartCenter}>
        <Text style={styles.pieChartCenterTitle}>GDP</Text>
        <Text style={styles.pieChartCenterValue}>{totalGDP}</Text>
        <Text style={styles.pieChartCenterUnit}>Billion USD</Text>
      </View>
    </View>
  );
};

export const CustomBarChart = ({ data, onBarPress }) => {
  return (
    <View style={styles.barChartContainer}>
      <BarChart
        data={data}
        width={width - 32}
        height={280}
        yAxisLabel="$"
        yAxisSuffix="B"
        chartConfig={{
          backgroundColor: '#F8FAFC',
          backgroundGradientFrom: '#F1F5F9',
          backgroundGradientTo: '#E2E8F0',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
          style: { borderRadius: 16 },
          propsForLabels: { fontSize: 11, fontWeight: '600' },
          propsForBackgroundLines: { strokeWidth: 1, stroke: '#CBD5E1' },
        }}
        style={styles.barChart}
        showValuesOnTopOfBars
        fromZero
        onDataPointClick={({ value, dataset, getColor, index }) => {
          onBarPress({
            year: data.labels[index],
            value,
            sector: dataset.name,
            color: getColor(1)
          });
        }}
      />
      <View style={styles.barChartLegend}>
        {data.datasets.map((dataset, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
            <Text style={styles.legendText}>{dataset.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barChartContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  barChart: { 
    borderRadius: 16,
  },
  barChartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  pieChartContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -110 }, { translateY: -30 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pieChartCenterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pieChartCenterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  pieChartCenterUnit: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});