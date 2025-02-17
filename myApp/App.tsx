// App.tsx
import React from "react";
import { UserProvider } from "./src/context/UserContext";  
import Navigator from "./src/navigation/Navigation";  

const App: React.FC = () => {
  return (
    <UserProvider>  
      <Navigator />
    </UserProvider>
  );
};

export default App;
