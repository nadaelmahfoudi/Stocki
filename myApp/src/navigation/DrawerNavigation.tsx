import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { useUser } from "../context/UserContext";
import { Text } from "react-native"; 
import HomeScreen from "../screens/HomeScreen";
import ListProductScreen from "../screens/ListProductScreen";
import LoginScreen from "../screens/LoginScreen";
import PDFScreen from "../screens/PDFScreen";
import StatisticScreen from "../screens/StatisticScreen";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    props.navigation.navigate("Login"); 
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {user && (
        <DrawerItem 
          label={() => <Text style={{ color: "red" }}>Logout</Text>} 
          onPress={handleLogout} 
          style={{ backgroundColor: "#f8d7da" }} 
        />
      )}
    </DrawerContentScrollView>
  );
};

const DrawerNavigation: React.FC = () => {
  const { user } = useUser();

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {user ? (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Products" component={ListProductScreen} />
          <Drawer.Screen name="Generate PDF and Share" component={PDFScreen} />
          <Drawer.Screen name="Statistics" component={StatisticScreen} />
        </>
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
