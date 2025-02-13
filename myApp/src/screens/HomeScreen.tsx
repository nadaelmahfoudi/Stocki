import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import HeaderMenu from "../components/HeaderMenu";
import { Camera, CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [productExists, setProductExists] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft: () => <HeaderMenu /> });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const response = await axios.get(`http://192.168.218.194:5000/api/products/${data}`);
      if (response.data.exists) {
        alert(`Product found: ${response.data.name}`);
      } else {
        setProductExists(false);
      }
    } catch (error) {
      alert('Error fetching product data.');
    }
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProductScreen');
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello, {user.name}! 🎉</Text>
      <Text style={styles.details}>Warehouse ID: {user.warehouseId}</Text>

      <TouchableOpacity style={styles.scanButton} onPress={() => setIsCameraVisible(true)}>
        <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      <Modal visible={isCameraVisible} animationType="slide">
        {hasPermission === null ? (
          <Text>Requesting camera permission...</Text>
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        )}
        {productExists === false && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#333" },
  details: { fontSize: 18, marginTop: 10, color: "#666" },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9F43',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
