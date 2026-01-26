import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCameraSimulator = () => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraState, setCameraState] = useState("idle");
  const photoTimeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const closeModalTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (closeModalTimeoutRef.current)
        clearTimeout(closeModalTimeoutRef.current);
    };
  }, []);

  const startCapture = (onPhotoTaken) => {
    setShowCameraModal(true);
    setCameraState("capturing");

    if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);
    photoTimeoutRef.current = setTimeout(() => {
      handlePhotoTaken(onPhotoTaken);
    }, 2000);
  };

  const handlePhotoTaken = (callback) => {
    setCameraState("loading");

    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      setCameraState("success");

      if (closeModalTimeoutRef.current)
        clearTimeout(closeModalTimeoutRef.current);
      closeModalTimeoutRef.current = setTimeout(() => {
        callback?.();
        setShowCameraModal(false);
        setCameraState("idle");
      }, 1500);
    }, 1500);
  };

  const closeCamera = () => {
    setShowCameraModal(false);
    setCameraState("idle");
  };

  return {
    showCameraModal,
    cameraState,
    startCapture,
    closeCamera,
  };
};

export const useAuth = () => {
  const getWithTimeout = async (key, timeout = 3000) => {
    const promise = AsyncStorage.getItem(key);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${key}`)), timeout),
    );
    return Promise.race([promise, timeoutPromise]);
  };

  const getCredentials = async () => {
    try {
      const userId = await getWithTimeout("userId");
      const token = await getWithTimeout("authToken");
      return { userId, token, success: true };
    } catch (error) {
      return {
        userId: null,
        token: null,
        success: false,
        error: error.message,
      };
    }
  };

  return { getCredentials };
};
