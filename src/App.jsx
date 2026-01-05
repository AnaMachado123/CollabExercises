import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MySaved from "./pages/MySaved";
import ViewExercise from "./pages/ViewExercise";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔁 DEFAULT: raiz vai para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-saved" element={<MySaved />} />

        {/* View exercise */}
        <Route path="/exercises/:id" element={<ViewExercise />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
