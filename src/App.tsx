import React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { AuthenticationContextProvider } from "./Contexts/Authentication/AuthenticationContext";
import { TankContextProvider } from "./Contexts/Tank/TankContext";
import Submarine from "./Domain/Submarine";
import submarineMuiTheme from "./Theme/SubmarineMuiTheme";
import './App.css';

function App() {
  return (
    <div className="App">
        <ThemeProvider theme={submarineMuiTheme}>
            <AuthenticationContextProvider>
                <TankContextProvider>
                    <Submarine />
                </TankContextProvider>
            </AuthenticationContextProvider>
        </ThemeProvider>
    </div>
  );
}

export default App;
