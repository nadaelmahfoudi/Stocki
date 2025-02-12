import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./DrawerNavigation";  
import { useUser } from "../context/UserContext"; 
import LoginScreen from "../screens/LoginScreen"; 


const Navigator: React.FC = () => {
  const { user } = useUser(); 

  return (
    <NavigationContainer>
      {user ? <DrawerNavigation /> : <LoginScreen />} 
    </NavigationContainer>
  );
};

export default Navigator;
