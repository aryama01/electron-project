const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("🔍 [API Client] Getting auth headers...");
  console.log(
      "📌 Token from localStorage:",
      token ? token.substring(0, 30) + "..." : "NOT FOUND"
  );

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiClient = {
  get: async (endpoint) => {
    const headers = getAuthHeaders();
    console.log("📌 GET request to:", endpoint);
    console.log(
        "📌 Headers:",
        { ...headers, Authorization: headers.Authorization ? headers.Authorization.substring(0, 30) + "..." : "none" }
    );

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!res.ok) {
      console.error("❌ API Error:", res.status);
      throw new Error("API Error");
    }

    const data = await res.json();
    console.log("✅ Response received:", data);
    return data;
  },

  post: async (endpoint, body) => {
    const headers = getAuthHeaders();
    console.log("📌 POST request to:", endpoint);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("❌ API Error:", res.status);
      throw new Error("API Error");
    }

    const data = await res.json();
    console.log("✅ Response received:", data);
    return data;
  },

  // Login method
  login: async (credentials) => {
    console.log(API_BASE_URL, "Attempting login with credentials:", { ...credentials, password: "********" });
    const data = await apiClient.post("/auth/login", credentials);
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("userId", data.userId || "");
    }
    //For electron app, we might want to send the token to the main process here using ipcRenderer
    // const data = window.electronAPI.sendLogin({ username, password });
    return data;
  },

  employeeCreate: async (employeeData) => {
    console.log("👤 Creating employee with data:", employeeData);
    try {
      const res = await apiClient.post("/employee/create", employeeData);
      return res;
    } catch (err) {
      console.error("❌ Failed to create employee:", err);
      throw err;
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    console.log("👤 Fetching current user info...");
    try {
      const data = await apiClient.get("/auth/me"); // backend should provide /auth/me
      return data;
    } catch (err) {
      console.error("❌ Failed to fetch current user:", err);
      return null;
    }
  },

  // Logout method
  logout: () => {
    console.log("🚪 Logging out user...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  },
};

export default apiClient;
