import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "56b746e5abca4055b0fc5aac0bfcc57b"; // Tu App ID real
const CHANNEL = "demoChannel";       // Asegúrate de usar el mismo canal en todos los dispositivos
const TOKEN = null;                  // Para pruebas, déjalo en null
const UNPUBLISH_DELAY = 5000;        // Retraso de 5000ms antes de eliminar un usuario publicado (5 segundos)

function VideoCall() {
  const localVideoRef = useRef(null);
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  // Almacenamos los usuarios remotos en un objeto: key = UID, value = objeto user
  const [remoteUsers, setRemoteUsers] = useState({});
  const [myUID, setMyUID] = useState(null);

  // Obtener o generar un UID persistente para este dispositivo
  useEffect(() => {
    let uid = localStorage.getItem("agoraUID");
    if (!uid) {
      uid = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem("agoraUID", uid);
    }
    console.log("[Agora] UID persistente:", uid);
    setMyUID(uid);
  }, []);

  useEffect(() => {
    if (!myUID) return; // Espera a tener el UID

    const initAgora = async () => {
      try {
        console.log("[Agora] Iniciando join con UID persistente:", myUID);
        // Usamos Number(myUID) para asegurar el tipo numérico; así, al refrescar se mantiene el mismo UID.
        await client.join(APP_ID, CHANNEL, TOKEN, Number(myUID));
        console.log("[Agora] Conectado al canal con UID:", myUID);

        // Crear pistas locales
        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        console.log("[Agora] Pistas locales creadas.");

        // Publicar pistas locales
        await client.publish([micTrack, camTrack]);
        console.log("[Agora] Pistas locales publicadas.");

        // Reproducir video local
        camTrack.play(localVideoRef.current);
        console.log("[Agora] Video local en reproducción.");

        // Manejo del evento "user-published"
        client.on("user-published", async (user, mediaType) => {
          console.log("[Agora] user-published recibido para UID:", user.uid, "tipo:", mediaType);
          try {
            await client.subscribe(user, mediaType);
            console.log("[Agora] Suscripción exitosa para UID:", user.uid, "tipo:", mediaType);
            if (mediaType === "video" && user.videoTrack) {
              setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
              // Esperamos un poco para que el contenedor se renderice
              setTimeout(() => {
                user.videoTrack.play(`remote-container-${user.uid}`);
                console.log("[Agora] Reproduciendo video remoto para UID:", user.uid);
              }, 100);
            }
            if (mediaType === "audio" && user.audioTrack) {
              user.audioTrack.play();
              console.log("[Agora] Reproduciendo audio remoto para UID:", user.uid);
            }
          } catch (err) {
            console.error("[Agora] Error al suscribirse al usuario remoto UID:", user.uid, err);
          }
        });

        // Manejo del evento "user-unpublished"
        client.on("user-unpublished", (user) => {
          console.log("[Agora] user-unpublished recibido para UID:", user.uid);
          // En lugar de eliminar inmediatamente, esperamos UNPUBLISH_DELAY ms
          setTimeout(() => {
            setRemoteUsers(prev => {
              if (prev[user.uid]) {
                console.log("[Agora] Eliminando usuario remoto UID:", user.uid);
                const updated = { ...prev };
                delete updated[user.uid];
                return updated;
              }
              return prev;
            });
          }, UNPUBLISH_DELAY);
        });

        // Manejo del evento "user-left"
        client.on("user-left", (user) => {
          console.log("[Agora] user-left recibido para UID:", user.uid);
          setRemoteUsers(prev => {
            const updated = { ...prev };
            delete updated[user.uid];
            return updated;
          });
        });

      } catch (error) {
        console.error("[Agora] Error en la inicialización:", error);
      }
    };

    initAgora();

    return () => {
      console.log("[Agora] Saliendo del canal...");
      client.leave();
    };
  }, [client, myUID]);

  return (
    <div>
      <h1>Videollamada con Agora</h1>
      <div>
        <h2>Video Local (UID: {myUID})</h2>
        <div
          ref={localVideoRef}
          style={{ width: "320px", height: "240px", backgroundColor: "black" }}
        />
      </div>
      <div>
        <h2>Videos Remotos</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {Object.values(remoteUsers).map(user => (
            <div
              key={user.uid}
              id={`remote-container-${user.uid}`}
              style={{
                width: "320px",
                height: "240px",
                backgroundColor: "black",
                margin: "10px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
