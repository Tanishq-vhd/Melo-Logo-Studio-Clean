import { auth } from "../firebase";

const API_BASE = process.env.REACT_APP_API_URL;

if (!API_BASE) {
  console.error("API URL is not defined in environment variables.");
}

const API_URL = `${API_BASE}/api`;

/* ================= SAFE JSON ================= */
const safeJson = async (res) => {
  if (res.status === 401) {
    if (!window.location.pathname.includes("/signin")) {
      window.location.href = "/signin";
    }
    return { message: "Session expired. Please sign in again." };
  }

  try {
    return await res.json();
  } catch {
    return { message: "Invalid server response" };
  }
};

/* ================= GET FIREBASE TOKEN ================= */
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) return {};

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ================= SIGNUP ================= */
export const signupUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await safeJson(res);
  } catch {
    return { message: "Network error. Please try again." };
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await safeJson(res);
  } catch {
    return { message: "Network error. Please try again." };
  }
};

/* ================= PROFILE ================= */
export const getProfile = async () => {
  try {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/profile`, {
      headers,
    });

    return await safeJson(res);
  } catch {
    return { message: "Network error. Please try again." };
  }
};