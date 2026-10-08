import axios from "axios";

// In dev, Vite proxies /predict, /history, /diseases, /stats, /uploads to
// the FastAPI server (see vite.config.js). In production, the built
// frontend is served by the same FastAPI process, so relative paths work
// unchanged in both environments.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.message ||
      "Something went wrong talking to the server.";
    return Promise.reject(new Error(message));
  }
);

export async function predictDisease(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
  return data;
}

export async function fetchDiseaseInfo(disease) {
  const { data } = await api.get(`/diseases/${disease}`);
  return data;
}

export async function fetchAllDiseases() {
  const { data } = await api.get("/diseases");
  return data;
}

export async function fetchHistory(limit = 50) {
  const { data } = await api.get("/history", { params: { limit } });
  return data;
}

export async function deleteHistoryEntry(id) {
  const { data } = await api.delete(`/history/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await api.get("/stats");
  return data;
}

export default api;
