import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderMenu: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 10 }}>
      <Text style={{ fontSize: 20 }}>☰</Text>  
    </TouchableOpacity>
  );
};

export default HeaderMenu;
