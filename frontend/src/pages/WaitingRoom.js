// src/pages/WaitingRoom.js
import React from "react";
import { useNavigate } from "react-router-dom";

function WaitingRoom() {
  const navigate = useNavigate();

  const handleStartCall = () => {
    navigate("/video-call");
  };

  return (
    <div>
      <h1>Sala de Espera</h1>
      <p>Espera a que se unan los demás participantes.</p>
      <button onClick={handleStartCall}>Iniciar Videollamada</button>
    </div>
  );
}

export default WaitingRoom;
