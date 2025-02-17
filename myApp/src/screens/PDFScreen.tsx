import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Share, FlatList, Image } from 'react-native';
import axios from 'axios';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const generatePdf = async (products) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
            h1 { text-align: center; color: #0f2a37; }
            .product { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #84bad5; }
            .product-name { font-weight: bold; font-size: 20px; color: #3d7692; }
            .product-price { font-size: 18px; color: #0f2a37; margin-top: 5px; }
            .product-info { font-size: 16px; color: #0f2a37; margin-top: 5px; }
            .product-image { width: 100%; height: 200px; border-radius: 8px; margin-top: 10px; }
            .container { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Product List</h1>
            ${products.map(product => `
              <div class="product">
                <img src="${product.image}" class="product-image" alt="Product Image"/>
                <p class="product-name">${product.name}</p>
                <p class="product-price">$${product.price}</p>
                <p class="product-info">Type: ${product.type}</p>
                <p class="product-info">Supplier: ${product.supplier}</p>
                <p class="product-info">Stock Locations:</p>
                ${product.stocks.map(stock => `
                  <p class="product-info">- ${stock.name}: ${stock.quantity} in ${stock.localisation.city}</p>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    const fileUri = FileSystem.documentDirectory + 'product-list.pdf';
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });

    console.log('PDF saved to:', fileUri);
    await Print.printAsync({ uri: fileUri });
    sharePdf(fileUri);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const sharePdf = async (fileUri) => {
  try {
    await Share.share({
      message: 'Here is the product list PDF!',
      url: fileUri,
    });
  } catch (error) {
    console.error("Error sharing the PDF:", error);
  }
};

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://172.16.11.246:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product PDF Generator</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productInfo}>Type: {item.type}</Text>
            <Text style={styles.productInfo}>Supplier: {item.supplier}</Text>
            <Text style={styles.productInfo}>Stock Locations:</Text>
            {item.stocks.map((stock, index) => (
              <Text key={index} style={styles.productInfo}>
                - {stock.name}: {stock.quantity} in {stock.localisation.city}
              </Text>
            ))}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Generate and Share PDF" onPress={() => generatePdf(products)} color="#0f2a37" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f2a37',
    textAlign: 'center',
    marginBottom: 20,
  },
  productCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#84bad5',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3d7692',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    color: '#0f2a37',
    marginTop: 5,
  },
  productInfo: {
    fontSize: 16,
    color: '#0f2a37',
    marginTop: 5,
  },
});

export default App;
