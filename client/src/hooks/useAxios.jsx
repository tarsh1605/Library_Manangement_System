import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: "https://library-manangement-system-4clw.onrender.com/api",
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
