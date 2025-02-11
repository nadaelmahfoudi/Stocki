import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello, {user.name}! 🎉</Text>
      <Text style={styles.details}>Warehouse ID: {user.warehouseId}</Text>
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
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
  },
});

export default HomeScreen;
