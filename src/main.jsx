import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import FullPageLoader from "./components/FullPageLoader.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <NextUIProvider>
        <Provider store={store}>
          <PersistGate loading={<FullPageLoader />} persistor={persistor}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </PersistGate>
        </Provider>
      </NextUIProvider>
    </HelmetProvider>
  </StrictMode>
);
