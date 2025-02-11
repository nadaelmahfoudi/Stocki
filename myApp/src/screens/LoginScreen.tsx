import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet, Text, Button } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://172.16.11.246:5000/api/auth/login", {  
        secretKey,
      });

      const user = response.data.user;
      setErrorMessage("");

      navigation.navigate("Home", { user });

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrorMessage("Invalid secret key or error with server.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <TextInput
        placeholder="Enter Secret Key"
        secureTextEntry
        style={styles.input}
        value={secretKey}
        onChangeText={setSecretKey}
      />
      <Button title="Login" onPress={handleLogin} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
