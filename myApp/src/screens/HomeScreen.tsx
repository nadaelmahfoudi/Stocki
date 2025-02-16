import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TextInput } from "react-native";
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [initialStocks, setInitialStocks] = useState<any>({});  
  const [barcode, setBarcode] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setBarcode(data);
    try {
      const response = await axios.get(`http://192.168.0.120:5000/api/products/${data}`);
      setProduct(response.data.exists ? response.data.product : null);
      if (response.data.exists) {
        const stocks = response.data.product.stocks.reduce((acc, stock) => {
          acc[stock.id] = stock.quantity;
          return acc;
        }, {});
        setInitialStocks(stocks);
      }
    } catch {
      alert('Product not found.');
    }
  };

  const handleStockChange = (stockId: number, quantityChange: number) => {
    setProduct(prevProduct => {
      const updatedStocks = prevProduct.stocks.map(stock =>
        stock.id === stockId
          ? { ...stock, quantity: stock.quantity + quantityChange }
          : stock
      );
      return { ...prevProduct, stocks: updatedStocks };
    });
  };

  const saveChanges = async () => {
    try {
      const stockUpdates = product.stocks.map((stock) => {
        const initialQuantity = initialStocks[stock.id];
        const newQuantity = stock.quantity;
        if (newQuantity !== initialQuantity) {
          return axios.put(`http://192.168.0.120:5000/api/stocks/${product.id}/${stock.id}`, {
            quantityChange: newQuantity - initialQuantity,
          });
        }
        return null; 
      }).filter(Boolean);

      if (stockUpdates.length > 0) {
        await Promise.all(stockUpdates);
        alert('Stock updated successfully');
        setInitialStocks({}); 
      } else {
        alert('No changes to update.');
      }
    } catch (error) {
      console.error("Error saving stock changes:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scanButton} onPress={() => setIsCameraVisible(true)}>
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      <Modal visible={isCameraVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          {hasPermission ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          ) : <Text>No access to camera</Text>}

          {scanned && (
            <View style={styles.modalContent}>
              {product ? (
                <>
                  <Text style={styles.modalTitle}>{product.name}</Text>
                  <Text style={styles.modalText}><Text style={styles.modalTextBold}>Type:</Text> {product.type}</Text>
                  <Text style={styles.modalText}><Text style={styles.modalTextBold}>Price:</Text> {product.price} DH</Text>
                  <Text style={styles.modalText}><Text style={styles.modalTextBold}>Supplier:</Text> {product.supplier}</Text>

                  {product.stocks?.map((stock, index) => {
                    return (
                      <View key={index} style={styles.stockContainer}>
                        <Text style={styles.modalText}>
                          <Text style={styles.modalTextBold}>Stock {index + 1}:</Text> {stock.quantity} units - {stock.localisation.city}
                        </Text>
                        <View style={styles.stockInputContainer}>
                          <TouchableOpacity onPress={() => handleStockChange(stock.id, -1)} style={styles.stockButton}>
                            <Text style={styles.stockButtonText}>-</Text>
                          </TouchableOpacity>
                          <TextInput
                            style={styles.stockInput}
                            value={String(stock.quantity)}
                            editable={false}
                          />
                          <TouchableOpacity onPress={() => handleStockChange(stock.id, 1)} style={styles.stockButton}>
                            <Text style={styles.stockButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                  <TouchableOpacity style={styles.addButton} onPress={saveChanges}>
                    <Text style={styles.addButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </>
              ) : (
<TouchableOpacity 
  style={styles.addButton} 
  onPress={() => navigation.navigate('AddProduct', { barcode })}
>
  <Text style={styles.addButtonText}>Add Product</Text>
</TouchableOpacity>

              )}
              <Button title="Close" onPress={() => {
                setScanned(false);
                setIsCameraVisible(false);
              }} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanButton: { padding: 12, borderRadius: 10, backgroundColor: '#FF9F43' },
  scanButtonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" },
  modalContent: { width: 320, padding: 20, backgroundColor: "#fff", borderRadius: 12, alignItems: "center", elevation: 8 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  modalTextBold: { fontWeight: "bold", color: "#333" },
  modalText: { fontSize: 16, marginVertical: 5, color: "#555" },
  addButton: { padding: 12, borderRadius: 10, backgroundColor: '#4CAF50' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  stockContainer: { marginVertical: 10, width: '100%' },
  stockInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockButton: { padding: 10, backgroundColor: '#FF9F43', borderRadius: 5 },
  stockButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  stockInput: { width: 50, textAlign: 'center', fontSize: 16, padding: 5, borderWidth: 1, borderRadius: 5, borderColor: '#ccc' }
});

export default HomeScreen;
