import { io } from "socket.io-client";
import { API_BASE } from "./api/config";

export const socket = io(API_BASE, {
  autoConnect: false, // We will manually connect when the user logs in
});
