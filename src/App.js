import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.min.css";
import "./App.css";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import ScanPage from "./Pages/Scan";
import AuthContextProvider from "./Auth/context/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthUser from "./Auth/index";
import ErrPage from "./Pages/ErrorPage";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthUser />} />
          <Route path="/" element={<ProtectedRoute ><Home /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute ><ScanPage /></ProtectedRoute>} />
          <Route path="/*" element={<ErrPage />} />;
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
