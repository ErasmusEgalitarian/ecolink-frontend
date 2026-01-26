import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DONATION_ENDPOINTS } from "../config/api";

/**
 * Hook customizado para gerenciar doações do usuário
 */
export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Busca todas as doações do usuário logado
   */
  const fetchUserDonations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${DONATION_ENDPOINTS.LIST}/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const donationsData = result.data || [];

      setDonations(donationsData);
      return donationsData;
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(err.message);
      setDonations([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    setDonations([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    donations,
    loading,
    error,
    fetchUserDonations,
    reset,
  };
};
