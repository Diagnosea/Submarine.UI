import React from 'react';
import { ThemeProvider } from "@material-ui/styles";
import { AuthenticationContextProvider } from "./Contexts/Authentication/AuthenticationContext";
import Submarine from "./Domain/Submarine";
import submarineMuiTheme from "./Theme/SubmarineMuiTheme";
import './App.css';

function App() {
  return (
    <div className="App">
        <ThemeProvider theme={submarineMuiTheme}>
            <AuthenticationContextProvider>
                <Submarine />
            </AuthenticationContextProvider>
        </ThemeProvider>
    </div>
  );
}

export default App;
