import { useCallback } from "react";

export const useFetch = () => {
  const fetchData = useCallback(async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method: method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });
      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }, []);

  return fetchData;
};
