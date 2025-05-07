import axios from "axios";
import { Design, Room, Furniture } from "../types";
import { useAuth } from "@clerk/clerk-react";

// Create API base URL
const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const getProducts = async (): Promise<Furniture[]> => {
  const response = await api.get("/products");
  return response.data.data;
};

// Rooms API
export const getUserRooms = async (userId: string): Promise<Room[]> => {
  const response = await api.get(`/rooms?userId=${userId}`);
  return response.data.data;
};

export const getRoomById = async (roomId: string): Promise<Room> => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data.data;
};

export const createRoom = async (roomData: Partial<Room>): Promise<Room> => {
  const response = await api.post("/rooms", roomData);
  return response.data.data;
};

export const updateRoom = async (
  roomId: string,
  roomData: Partial<Room>
): Promise<Room> => {
  const response = await api.put(`/rooms/${roomId}`, roomData);
  return response.data.data;
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/rooms/${roomId}`);
};

// Designs API
export const getUserDesigns = async (userId: string): Promise<Design[]> => {
  const response = await api.get(`/designs?userId=${userId}`);
  return response.data.data;
};

export const getDesignById = async (designId: string): Promise<Design> => {
  const response = await api.get(`/designs/${designId}`);
  return response.data.data;
};

export const createDesign = async (
  designData: Partial<Design>
): Promise<Design> => {
  const response = await api.post("/designs", designData);
  return response.data.data;
};

export const updateDesign = async (
  designId: string,
  designData: Partial<Design>
): Promise<Design> => {
  const response = await api.put(`/designs/${designId}`, designData);
  return response.data.data;
};

export const deleteDesign = async (designId: string): Promise<void> => {
  await api.delete(`/designs/${designId}`);
};

// Custom hook to use the API with Clerk authentication
export const useApi = () => {
  const { userId } = useAuth();

  return {
    // Furniture functions
    getProducts,

    // Room functions
    getUserRooms: () => getUserRooms(userId || ""),
    getRoomById,
    createRoom: (roomData: Partial<Room>) =>
      createRoom({ ...roomData, userId: userId || "" }),
    updateRoom,
    deleteRoom,

    // Design functions
    getUserDesigns: () => getUserDesigns(userId || ""),
    getDesignById,
    createDesign: (designData: Partial<Design>) =>
      createDesign({ ...designData, userId: userId || "" }),
    updateDesign,
    deleteDesign,
  };
};
