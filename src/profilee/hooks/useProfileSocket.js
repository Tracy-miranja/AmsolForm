import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_ORIGIN } from "../shared/api";

export default function useProfileSocket(token) {
  const socketRef = useRef(null);
  useEffect(() => {
    if (!token) return;
    const socket = io(API_ORIGIN, { auth: { token }, withCredentials: true });
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [token]);
  return socketRef;
}
