import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MySaved from "./pages/MySaved";
import ViewExercise from "./pages/ViewExercise";
import EditExercise from "./pages/EditExercise";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-saved" element={<MySaved />} />

        <Route path="/exercises/:id" element={<ViewExercise />} />
        <Route path="/exercises/:id/edit" element={<EditExercise />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
