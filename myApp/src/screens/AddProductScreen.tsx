import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const AddProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Initialize barcode with either the passed param or an empty string
  const [barcode, setBarcode] = useState(route.params?.barcode || '');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [solde, setSolde] = useState('');
  const [supplier, setSupplier] = useState('');
  const [image, setImage] = useState('');
  const [stocks, setStocks] = useState([{ name: '', quantity: '', localisation: '' }]);

  // Effect hook to handle route changes
  useEffect(() => {
    if (route.params?.barcode) {
      setBarcode(route.params.barcode);
    }
  }, [route.params?.barcode]);

  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...stocks];
    updatedStocks[index][field] = value;
    setStocks(updatedStocks);
  };

  const addStockField = () => {
    setStocks([...stocks, { name: '', quantity: '', localisation: '' }]);
  };

  const handleAddProduct = async () => {
    if (!name || !type || !barcode || !price || !solde || !supplier || !image || stocks.some(s => !s.name || !s.quantity || !s.localisation)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
  
    // Check if barcode is received from route or set manually
    const finalBarcode = barcode || 'default-manual-barcode';  // Replace 'default-manual-barcode' with any default value if needed
  
    const newProduct = {
      name,
      type,
      barcode: finalBarcode,
      price: parseFloat(price),
      solde: parseFloat(solde),
      supplier,
      image,
      stocks: stocks.map(stock => ({
        name: stock.name,
        quantity: parseInt(stock.quantity),
        localisation: {
          city: stock.localisation,
          latitude: 0,
          longitude: 0
        }
      })),
      editedBy: [{ warehousemanId: 'user-id-placeholder', at: new Date().toISOString() }]
    };
  
    try {
      const response = await axios.post('http://172.16.11.246:5000/api/products', newProduct);
      if (response.status === 201) {
        Alert.alert('Succès', 'Produit ajouté avec succès.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter le produit.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nom du produit :</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Nom du produit" style={styles.input} />

      <Text style={styles.label}>Type :</Text>
      <TextInput value={type} onChangeText={setType} placeholder="Type de produit" style={styles.input} />

      <Text style={styles.label}>Code-barres :</Text>
      <TextInput value={barcode} onChangeText={setBarcode} placeholder="Code-barres" keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Prix :</Text>
      <TextInput value={price} onChangeText={setPrice} placeholder="Prix" keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Solde :</Text>
      <TextInput value={solde} onChangeText={setSolde} placeholder="Solde" keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Fournisseur :</Text>
      <TextInput value={supplier} onChangeText={setSupplier} placeholder="Fournisseur" style={styles.input} />

      <Text style={styles.label}>URL de l'image :</Text>
      <TextInput value={image} onChangeText={setImage} placeholder="URL de l'image" style={styles.input} />

      <Text style={styles.label}>Stocks :</Text>
      {stocks.map((stock, index) => (
        <View key={index} style={styles.stockInputWrapper}>
          <TextInput
            placeholder="Nom du stock"
            value={stock.name}
            onChangeText={value => handleStockChange(index, 'name', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Quantité"
            value={stock.quantity}
            keyboardType="numeric"
            onChangeText={value => handleStockChange(index, 'quantity', value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Localisation"
            value={stock.localisation}
            onChangeText={value => handleStockChange(index, 'localisation', value)}
            style={styles.input}
          />
        </View>
      ))}
      <Button title="Ajouter un stock" onPress={addStockField} color="#5e84e2" />
      <Button title="Ajouter le produit" onPress={handleAddProduct} color="#28a745" />
    </ScrollView>
  );
};

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#f4f9fc',
  },
  label: {
    color: '#0f2a37',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d7692',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  stockInputWrapper: {
    marginBottom: 15,
  },
};

export default AddProductScreen;
