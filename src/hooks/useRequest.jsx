import { useState, useCallback } from "react";
import userAxiosInstance from "../config/axiosConfig/userAxiosInstance";

const useRequest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (config) => {
    if (!config.url) {
      setError("The 'url' property is required in the config.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Sending request to:", config.url);
      const response = await userAxiosInstance({
        method: config.method || "GET",
        url: config.url,
        data: config.data || null,
        headers: config.headers || {},
      });

      setData(response.data);
      if (config.onSuccess) {
        config.onSuccess(response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong!";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
      if (config.onError) {
        config.onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, sendRequest };
};

export default useRequest;
