import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Add routing
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./components/Home";
import GreenHarvestAssistant from "./components/GreenHarvestAssistant"; // Uncomment and ensure correct path


const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {" "}
        {/* Add Router here instead of in Home */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home as main route */}
          <Route path="/ask-ai" element={<GreenHarvestAssistant />} />{" "}
        
          
          {/* AI route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
