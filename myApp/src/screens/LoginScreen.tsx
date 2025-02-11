import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";

const LoginScreen = () => {
    const [secretKey, setSecretKey] = useState("");

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
});

export default LoginScreen;
