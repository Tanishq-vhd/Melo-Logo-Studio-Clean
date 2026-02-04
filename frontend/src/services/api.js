const API_URL = "http://localhost:5000/api";

// ✅ SAFE response handler (NO throwing)
const safeJson = async (res) => {
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
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await safeJson(res);
  } catch {
    return { message: "Network error. Please try again." };
  }
};

// ================== PROFILE ==================
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

    return await safeJson(res);
  } catch {
    return { message: "Network error. Please try again." };
  }
};
