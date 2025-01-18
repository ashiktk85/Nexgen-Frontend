import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./Routes/User";
import { Toaster } from "sonner";
import Employer from "./Routes/Employer";
import Admin from "./Routes/Admin";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";

function App() {
  return (
    <>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/*" element={<User />} />
            <Route path="/employer/*" element={<Employer />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          expand={true}
          closeButton
          richColors
          duration={5000}
        />
      </PersistGate>
    </>
  );
}

export default App;

