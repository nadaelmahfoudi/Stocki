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
  totalStockValue: number;
  mostAddedProducts: { name: string, addedCount: number }[];
  mostRemovedProducts: { name: string, removedCount: number }[];
}

const StatisticScreen = () => {
  const { user } = useUser(); 
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProductStockValue = (stocks: StockLocation[], price: number) => {
    return stocks.reduce((total, stock) => total + (stock.quantity * price), 0);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) {
        setError('User not found');
        return;
      }
      try {
        const response = await axios.get(`http://192.168.0.120:5000/api/statistics/${user.id}`);
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
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Text style={styles.title}>Product Statistics for Warehouse {user?.id}</Text>

      {statistics?.products?.map((product) => {
        const totalStockValue = calculateProductStockValue(product.stocks, product.price);

        return (
          <View key={product.id} style={styles.productContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>Price: ${product.price}</Text>
            <Text style={styles.productValue}>Total Stock Value: ${totalStockValue}</Text>

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

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Total Products:</Text>
        <Text style={styles.statValue}>{statistics?.totalProducts}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Out of Stock:</Text>
        <Text style={styles.statValue}>{statistics?.outOfStock}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Total Stock Value:</Text>
        <Text style={styles.statValue}>${statistics?.totalStockValue}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Most Added Products:</Text>
        <FlatList
          data={statistics?.mostAddedProducts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.name}: {item.addedCount} added</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statTitle}>Most Removed Products:</Text>
        <FlatList
          data={statistics?.mostRemovedProducts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.name}: {item.removedCount} removed</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  productContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
  },
  productPrice: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
  productValue: {
    fontSize: 16,
    marginTop: 4,
    color: '#555',
  },
  stockItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  stockText: {
    fontSize: 16,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#777',
  },
  statItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  errorText: {
    color: 'red',
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
