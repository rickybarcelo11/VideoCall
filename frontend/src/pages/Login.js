// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en login");
      localStorage.setItem("token", data.token);
      navigate("/waiting-room");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
      </p>
    </div>
  );
}

export default Login;
