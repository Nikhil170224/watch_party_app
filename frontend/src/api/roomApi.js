import axios from "axios";

const API_URL = "http://localhost:4000/api/rooms";

export const createRoom = async (username) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/create`,
      { username },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data; // Returns the room object with the roomCode
  } catch (error) {
    throw error.response?.data?.message || "Failed to create room";
  }
};

export const getRoomDetails = async (roomCode) => {
  try {
    const response = await axios.get(`${API_URL}/${roomCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Room not found";
  }
};
