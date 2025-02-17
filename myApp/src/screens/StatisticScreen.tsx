import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface StockLocation {
  id: number;
  name: string;
  quantity: number;
  localisation: {
    city: string;
    latitude: number;
    longitude: number;
  };
}

interface Product {
  id: number;
  name: string;
  price: number;
  stocks: StockLocation[];
  image: string;
}

interface ProductStatistics {
  totalProducts: number;
  outOfStock: number;
  totalQuantity: number; // Changed from totalStockValue
  products: Product[];
}

const StatisticScreen = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalQuantity = (stocks: StockLocation[]) => {
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) {
        setError('User not found');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://172.16.11.246:5000/api/statistics/${user.id}`);
        setStatistics(response.data);
      } catch (err: any) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#84bad5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Warehouse Statistics</Text>

      {/* Product List */}
      {statistics?.products?.map((product) => {
        const totalQuantity = calculateTotalQuantity(product.stocks);

        return (
          <View key={product.id} style={styles.productContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>Price: ${product.price}</Text>
            <Text
              style={[
                styles.productValue,
                totalQuantity === 0 ? styles.outOfStockValue : {},
              ]}
            >
              Total Stock Quantity: {totalQuantity}
            </Text>

            <FlatList
              data={product.stocks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.stockItem}>
                  <Text style={styles.stockText}>{item.name}: {item.quantity} items</Text>
                  <Text style={styles.locationText}>Location: {item.localisation.city}</Text>
                </View>
              )}
            />
          </View>
        );
      })}

      {/* Statistics Overview */}
      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Total Products:</Text>
        <Text style={styles.statValue}>{statistics?.totalProducts}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Out of Stock:</Text>
        <Text style={styles.statValue}>{statistics?.outOfStock}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Total Stock Quantity:</Text>
        <Text style={styles.statValue}>{statistics?.totalQuantity}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9fc',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f2a37',
    marginBottom: 20,
    fontFamily: 'Roboto-Bold',
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#0f2a37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3d7692',
  },
  productPrice: {
    fontSize: 18,
    color: '#84bad5',
    marginTop: 8,
  },
  productValue: {
    fontSize: 18,
    color: '#84bad5',
    marginTop: 6,
  },
  outOfStockValue: {
    color: '#d9534f', // Red color for out-of-stock values
  },
  stockItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stockText: {
    fontSize: 16,
    color: '#444',
  },
  locationText: {
    fontSize: 14,
    color: '#888',
  },
  statItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#0f2a37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3d7692',
  },
  statValue: {
    fontSize: 18,
    color: '#0f2a37',
    marginTop: 8,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatisticScreen;
