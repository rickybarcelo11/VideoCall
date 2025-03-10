import React, { useEffect, useRef } from "react";

const VideoCall = () => {
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Solicitar acceso a la cámara y el micrófono
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream; // Mostrar el video local
        }
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara y micrófono:", error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Videollamada</h2>
      <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border-2 border-white rounded-md shadow-lg" />
    </div>
  );
};

export default VideoCall;
