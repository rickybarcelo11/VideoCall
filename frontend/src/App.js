// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WaitingRoom from "./pages/WaitingRoom";
import VideoCall from "./pages/VideoCall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route path="/video-call" element={<VideoCall />} />
    </Routes>
  );
}

export default App;
