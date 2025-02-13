import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddProductScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AddProductScreen;
