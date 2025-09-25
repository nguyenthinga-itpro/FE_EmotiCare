import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "../src/redux/store.jsx";
import { ThemeProvider } from "./Themes/ThemeContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider >
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
