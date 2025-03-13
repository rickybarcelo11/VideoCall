import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [peerConnection, setPeerConnection] = useState(null);
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        async function startMedia() {
            try {
                console.log("🔄 Iniciando solicitud de acceso a cámara/micrófono...");

                // Verificar compatibilidad con WebRTC
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.error("❌ Este navegador no soporta acceso a la cámara/micrófono.");
                    setError("Este navegador no soporta acceso a la cámara/micrófono.");
                    return;
                }

                // Obtener acceso a la cámara y micrófono
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                console.log("✅ Cámara y micrófono activados.");

                // Crear conexión WebRTC
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                setPeerConnection(pc);

                // Enviar candidatos ICE
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log("📡 Enviando candidato ICE:", event.candidate);
                        socket.emit("ice-candidate", { target: users[0], candidate: event.candidate });
                    }
                };

                // Recibir stream remoto
                pc.ontrack = (event) => {
                    console.log("📡 Recibiendo stream remoto...");
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                // Manejar eventos de usuarios conectados
                socket.on("users-list", (userList) => {
                    console.log("👥 Usuarios conectados:", userList);
                    setUsers(userList.filter((id) => id !== socket.id));
                });

                socket.on("user-connected", (userId) => {
                    console.log("🟢 Usuario conectado:", userId);
                    setUsers((prev) => [...prev, userId]);
                });

                socket.on("user-disconnected", (userId) => {
                    console.log("🔴 Usuario desconectado:", userId);
                    setUsers((prev) => prev.filter((id) => id !== userId));
                });

                // Manejar ofertas de WebRTC
                socket.on("offer", async ({ sender, sdp }) => {
                    console.log("📩 Recibida oferta de:", sender);
                    if (!pc) return;
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        socket.emit("answer", { target: sender, sdp: answer });
                    } catch (error) {
                        console.error("❌ Error al procesar oferta:", error);
                    }
                });

                // Manejar respuestas de WebRTC
                socket.on("answer", async ({ sender, sdp }) => {
                    console.log("📩 Recibida respuesta de:", sender);
                    if (!pc) return;
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    } catch (error) {
                        console.error("❌ Error al procesar respuesta:", error);
                    }
                });

                // Manejar candidatos ICE
                socket.on("ice-candidate", async ({ sender, candidate }) => {
                    console.log("📡 Recibido candidato ICE de:", sender);
                    if (!pc) return;
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error("❌ Error al agregar candidato ICE:", error);
                    }
                });

            } catch (err) {
                console.error("❌ No se pudo acceder a la cámara/micrófono:", err);
                setError("No se pudo acceder a la cámara/micrófono. Revisa los permisos.");
            }
        }

        startMedia();

        return () => {
            console.log("🔄 Limpiando eventos de WebRTC...");
            socket.off("users-list");
            socket.off("user-connected");
            socket.off("user-disconnected");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h2 className="text-2xl mb-4">Videollamada</h2>

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <p>📷 Cámara activada...</p>
                    <video ref={localVideoRef} autoPlay playsInline className="w-1/3 border-2 border-white rounded-md shadow-lg" />
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-1/3 border-2 border-white rounded-md shadow-lg mt-4" />
                </>
            )}
        </div>
    );
};

export default VideoCall;
