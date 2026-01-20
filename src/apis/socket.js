import { io } from "socket.io-client";

let socket = null;

export function connectSocket(userId) {
    if (!userId) return null;
    const backendBase = import.meta.env.VITE_BASE_URL.replace(/\/api$/, "");
    socket = io(backendBase, { query: { userId } });
    return socket;
}

export function getSocket() { return socket; }
export function disconnectSocket() { if (socket) socket.disconnect(); socket = null; }
