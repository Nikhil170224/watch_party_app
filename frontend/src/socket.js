import { io } from "socket.io-client";

// This points to your Node.js server we just finished
const URL = "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false, // We will manually connect when the user logs in
});
