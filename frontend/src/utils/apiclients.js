const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("🔍 [API Client] Getting auth headers...");
  console.log("📌 Token from localStorage:", token ? token.substring(0, 30) + "..." : "NOT FOUND");
  
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiClient = {
  get: async (endpoint) => {
    const headers = getAuthHeaders();
    console.log("📌 GET request to:", endpoint);
    console.log("📌 Headers:", { ...headers, Authorization: headers.Authorization ? headers.Authorization.substring(0, 30) + "..." : "none" });
    
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
};

export default apiClient;