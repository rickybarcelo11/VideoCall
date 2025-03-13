import { io } from "socket.io-client";

const socket = io("http://192.168.0.15:5000", {
    transports: ["websocket"],
});

export default socket;
