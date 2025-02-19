import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      console.log("✅ Inicio de sesión exitoso:", response.data);
      localStorage.setItem("token", response.data.token); // Guardar el token en localStorage
      navigate("/videocall"); // Redirigir a la videollamada después de iniciar sesión
    } catch (err) {
      console.error("❌ Error en el inicio de sesión:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col w-80 space-y-4" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" className="p-2 border rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" className="p-2 border rounded" onChange={handleChange} />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
