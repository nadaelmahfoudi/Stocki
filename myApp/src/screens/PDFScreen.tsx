import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Share } from 'react-native';
import axios from 'axios';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const generatePdf = async () => {
  try {
    // Fetch product data from API
    const response = await axios.get("http://172.16.11.246:5000/api/products");

    // Extract product data from response
    const products = response.data;

    // Create dynamic HTML content from the fetched products
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
            h1 { text-align: center; color: #333; }
            .product { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
            .product-name { font-weight: bold; font-size: 18px; color: #2e8b57; }
            .product-price { font-size: 16px; color: #555; }
            .container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Product List</h1>
            ${products.map(product => `
              <div class="product">
                <p class="product-name">${product.name}</p>
                <p class="product-price">$${product.price}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Generate the PDF from HTML content
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Optionally save the PDF file to File System
    const fileUri = FileSystem.documentDirectory + 'product-list.pdf';
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });

    console.log('PDF saved to:', fileUri);

    // Optionally, print the PDF
    await Print.printAsync({ uri: fileUri });

    // Share the PDF
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

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Product PDF Generator</Text>
    <Button title="Generate and Share PDF" onPress={generatePdf} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default App;
