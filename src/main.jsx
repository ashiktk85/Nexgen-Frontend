import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <NextUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
     </NextUIProvider>
  </StrictMode>,
)
