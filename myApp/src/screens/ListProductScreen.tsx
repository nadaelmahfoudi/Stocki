import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Modal, Button } from "react-native";
import axios from "axios";

const ListProductScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); 
  const [modalVisible, setModalVisible] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://172.16.11.246:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const showProductDetails = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Produits</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.price}>Prix: {item.price} DH</Text>
              <Button title="Afficher les détails" onPress={() => showProductDetails(item)} />
            </View>
          </View>
        )}
      />

      {selectedProduct && (
        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
      <Text style={styles.modalText}>
        <Text style={styles.modalTextBold}>Type: </Text>
        {selectedProduct.type}
      </Text>
      <Text style={styles.modalText}>
        <Text style={styles.modalTextBold}>Supplier: </Text>
        {selectedProduct.supplier}
      </Text>
      <Text style={styles.modalText}>
        <Text style={styles.modalTextBold}>Price: </Text>
        {selectedProduct.price} DH
      </Text>
      <Text style={styles.modalText}>
        <Text style={styles.modalTextBold}>Stock Locations:</Text>
      </Text>
      {selectedProduct.stocks.map((stock: any, index: number) => (
        <Text key={index} style={styles.modalText}>
          <Text style={styles.modalTextBold}>{stock.name} </Text>
          (Quantity: {stock.quantity}) - {stock.localisation.city}
        </Text>
      ))}
      <Button title="Fermer" onPress={() => setModalVisible(false)} />
    </View>
  </View>
</Modal>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  info: {
    marginLeft: 15,
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  type: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalTextBold: {
    fontWeight: "bold",
    color: "#333",
  },
  
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
});

export default ListProductScreen;
