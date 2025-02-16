import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Modal, TouchableOpacity, TextInput, Keyboard } from "react-native";
import axios from "axios";

const ListProductScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minQuantity, setMinQuantity] = useState<string>('');
  const [maxQuantity, setMaxQuantity] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.0.120:5000/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const price = parseFloat(product.price);
      const quantity = product.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
      return (
        (minPrice ? price >= parseFloat(minPrice) : true) &&
        (maxPrice ? price <= parseFloat(maxPrice) : true) &&
        (minQuantity ? quantity >= parseInt(minQuantity) : true) &&
        (maxQuantity ? quantity <= parseInt(maxQuantity) : true)
      );
    });
    setFilteredProducts(filtered);
    Keyboard.dismiss();
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinQuantity('');
    setMaxQuantity('');
    setSearchQuery('');
    setFilteredProducts(products);
  };

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
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />

      <View style={styles.filterContainer}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Min Price"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Price"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Min Quantity"
            keyboardType="numeric"
            value={minQuantity}
            onChangeText={setMinQuantity}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Quantity"
            keyboardType="numeric"
            value={maxQuantity}
            onChangeText={setMaxQuantity}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={filterProducts}>
          <Text style={styles.buttonText}>Filtrer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.resetButton]} onPress={resetFilters}>
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.price}>Prix: {item.price} DH</Text>
              <TouchableOpacity style={styles.detailsButton} onPress={() => showProductDetails(item)}>
                <Text style={styles.buttonText}>Afficher les détails</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {selectedProduct && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
              <Text style={styles.modalText}><Text style={styles.modalTextBold}>Type: </Text>{selectedProduct.type}</Text>
              <Text style={styles.modalText}><Text style={styles.modalTextBold}>Supplier: </Text>{selectedProduct.supplier}</Text>
              <Text style={styles.modalText}><Text style={styles.modalTextBold}>Price: </Text>{selectedProduct.price} DH</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 15 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#333" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
  },
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 6 },
  image: { width: 90, height: 90, borderRadius: 12 },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  type: { fontSize: 16, color: "#777", marginVertical: 5 },
  price: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  filterContainer: { marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  input: { flex: 1, marginHorizontal: 5, padding: 10, backgroundColor: "#fff", borderRadius: 8, borderColor: "#ccc", borderWidth: 1 },
  filterButton: { backgroundColor: "#007BFF", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 5 },
  resetButton: { backgroundColor: "#d9534f" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  closeButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 8, marginTop: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "85%", alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginVertical: 5 },
  modalTextBold: { fontWeight: "bold" },
});

export default ListProductScreen;
