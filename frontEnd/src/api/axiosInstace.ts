
import axios from "axios";
import { LocalStorage } from "../utils";
import type { fileUpload } from "../interface/api";
import { normalizeFiles } from "../pages/Devotions/utitlty";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});


// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


// Response interceptor: handle expired token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshAccessAndRefreshToken();
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // retry original request
      } catch (err) {
        // refresh failed → logout user
        console.error("Refresh failed", err);
        // redirect to login
      }
    }
    return Promise.reject(error);
  }
);

// API functions for refresh both access and refresh token
export const refreshAccessAndRefreshToken = ()=>{
  return apiClient.post("/authentication/refresh")
}

// API functions for generating and saving question to the database
 export const generateAndSaveQuestions = (data: { topic: string }) => {
  return apiClient.post("/questions", data);
};

// Api for fetching comparison data for the 7 jumuiyas
export const  fetchJumuiyaComparisonData = () =>{
  return apiClient.get("/csa/jumuiya-comparison");
}

// Api for fetching user specific progress data
export const memberProgressData = ()=>{
 return apiClient.get("/member/:id/progress");
}

// Api for fetching user specific summary data of the progress
export const memberSummaryData = ()=>{
  return apiClient.get("/member/:id/summary")
}

// Api for fetching user specific progress data
export const individualJumuiAttemptsData =( jumuiyaId : number)=>{
  return apiClient.get(`/attempts/jumuiya/${jumuiyaId}`)
}

// Api for fetching notification data either at csa or jumuiya level
export const fetchNotifications = (jumuiyaId: number) =>{
  return apiClient.get( `/notifications?jumuiyaId=${jumuiyaId}&posted_to=csa`)
} 
// http://localhost:3001/api/v1//notifications/jumuiya=123abc&posted_to=csa

export const createNotificationEventApi= (payload: { title: string; message: string; images?: fileUpload[]; posted_To?: string; status?: string;}) => {
  return apiClient.post("/notifications", payload);
};

// http://localhost:3001/api/v1//notifications


// Api for uploading one or many files this may include images and videos, 
export const uploadFile = (files: File[] | File) => {
  const formData = new FormData();
  normalizeFiles(files).forEach((file) => formData.append("files", file));

  return apiClient.post("/files", formData, {headers: {"Content-Type": "multipart/form-data", },
  });
};


// ?api to handle fetching all uploaded files this
//  is useful for the admin to view all the uploaded files and manage them if needed
export const fetchAllUploadedFiles = () => {
  return apiClient.post("/files");
};



// Delete one or many files by publicId(s)
export const deleteOneOrMoreFiles = (publicIds: string | string[]) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  return apiClient.delete("/files", {
    data: { publicIds: ids }, 
  });
};


