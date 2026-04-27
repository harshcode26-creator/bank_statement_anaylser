import axios from "axios";

const WAKE_UP_DELAY_MS = 1500;

let apiStatusController = null;
let wakeUpTimerId = null;
let trackedRequestCount = 0;
let apiStatusSnapshot = {
  isWakingUp: false,
  hasWokenUp: false,
};

const syncApiStatus = (nextStatus) => {
  const mergedStatus = { ...apiStatusSnapshot, ...nextStatus };

  if (
    mergedStatus.isWakingUp === apiStatusSnapshot.isWakingUp &&
    mergedStatus.hasWokenUp === apiStatusSnapshot.hasWokenUp
  ) {
    return;
  }

  apiStatusSnapshot = mergedStatus;
  apiStatusController?.sync(apiStatusSnapshot);
};

const clearWakeUpTimer = () => {
  if (wakeUpTimerId === null) {
    return;
  }

  window.clearTimeout(wakeUpTimerId);
  wakeUpTimerId = null;
};

const shouldTrackWakeUp = () => !apiStatusSnapshot.hasWokenUp;

const startWakeUpTimer = () => {
  if (wakeUpTimerId !== null || trackedRequestCount === 0 || !shouldTrackWakeUp()) {
    return;
  }

  wakeUpTimerId = window.setTimeout(() => {
    wakeUpTimerId = null;

    if (trackedRequestCount > 0 && shouldTrackWakeUp()) {
      syncApiStatus({ isWakingUp: true });
    }
  }, WAKE_UP_DELAY_MS);
};

const settleWakeUpRequest = (config, didReceiveResponse) => {
  if (!config?.metadata?.trackWakeUp) {
    return;
  }

  trackedRequestCount = Math.max(0, trackedRequestCount - 1);

  if (didReceiveResponse) {
    trackedRequestCount = 0;
    clearWakeUpTimer();
    syncApiStatus({
      isWakingUp: false,
      hasWokenUp: true,
    });
    return;
  }

  if (trackedRequestCount === 0) {
    clearWakeUpTimer();
    syncApiStatus({ isWakingUp: false });
  }
};

export const registerApiStatusController = (controller) => {
  apiStatusController = controller;
  apiStatusController.sync(apiStatusSnapshot);

  return () => {
    if (apiStatusController === controller) {
      apiStatusController = null;
    }
  };
};

const API = axios.create({
  baseURL: "https://finnova-backend-xc19.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const trackWakeUp = shouldTrackWakeUp();
  const token = localStorage.getItem("token");

  config.metadata = {
    ...config.metadata,
    trackWakeUp,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (trackWakeUp) {
    trackedRequestCount += 1;
    startWakeUpTimer();
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    settleWakeUpRequest(response.config, true);
    return response;
  },
  (error) => {
    settleWakeUpRequest(error.config, Boolean(error.response));
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);

  return res.data;
};

export const signupUser = async (data) => {
  const res = await API.post("/auth/signup", data);

  return res.data;
};

export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getUploadById = async (id) => {
  const res = await API.get(`/upload/${id}`);

  return res.data;
};

export const getUploads = async () => {
  const res = await API.get("/upload");

  return res.data;
};

export const getTransactions = async (id, params = {}) => {
  const res = await API.get(`/upload/${id}/transactions`, { params });

  return res.data;
};

export const updateUpload = async (id, data) => {
  const res = await API.patch(`/upload/${id}`, data);

  return res.data;
};

export const deleteUpload = async (id) => {
  const res = await API.delete(`/upload/${id}`);

  return res.data;
};
