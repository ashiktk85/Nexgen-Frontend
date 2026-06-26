import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import RouteFallback from "@/components/RouteFallback";
import User from "./Routes/User";

const Employer = lazy(() => import("./Routes/Employer"));
const Admin = lazy(() => import("./Routes/Admin"));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/*" element={<User />} />
            <Route path="/employer/*" element={<Employer />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster
        position="top-center"
        expand={true}
        closeButton
        richColors
        duration={5000}
      />
    </>
  );
}

export default App;
