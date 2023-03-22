import axios from "axios";

const BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: BASE_URL,
});

export const createLayer = async (layer) => {
  try {
    const response = await api.post("/layers", layer);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create layer");
  }
};

export const getLayers = async () => {
  try {
    const response = await api.get("/layers");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get layers");
  }
};

export const deleteLayer = async (layerId) => {
  try {
    const response = await api.delete(`/layers/${layerId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete layer");
  }
};

export default api;
