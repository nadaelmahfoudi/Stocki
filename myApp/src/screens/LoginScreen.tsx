import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";

const LoginScreen: React.FC = () => {
  const [secretKey, setSecretKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setUser } = useUser();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://172.16.11.246:5000/api/auth/login", {  
        secretKey,
      });

      const user = response.data.user;
      setErrorMessage("");
      setUser(user);
      navigation.navigate("Home");

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrorMessage("Invalid secret key or error with server.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        placeholder="Enter Secret Key"
        secureTextEntry
        style={styles.input}
        value={secretKey}
        onChangeText={setSecretKey}
        placeholderTextColor="#84bad5"
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f2a37",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#84bad5",
    marginBottom: 20,
  },
  input: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#84bad5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#3d7692",
    textAlign: "center",
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#84bad5",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#0f2a37",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;
