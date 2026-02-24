const API_BASE = process.env.REACT_APP_API_URL;

if (!API_BASE) {
  console.error("API URL is not defined in environment variables.");
}

const API_URL = `${API_BASE}/api`;

// ✅ SAFE response handler with Auth Check
const safeJson = async (res) => {
  // If the server says 401, the token is expired (the error you saw)
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Only redirect if we aren't already on the signin page
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

// ================== SIGNUP ==================
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

// ================== LOGIN ==================
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

// ================== PROFILE (Syncs isPremium) ==================
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { message: "Not authenticated" };
  }

  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await safeJson(res);

    // ✅ SYNC: If profile returns fresh isPremium status, update localStorage
    if (data && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch {
    return { message: "Network error. Please try again." };
  }
};