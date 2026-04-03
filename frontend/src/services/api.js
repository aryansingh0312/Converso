// API Service for communicating with the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

class APIService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(name, email, password) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    this.clearToken();
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/api/users/me");
  }

  async getAllUsers() {
    return this.request("/api/users");
  }

  async getUserById(userId) {
    return this.request(`/api/users/${userId}`);
  }

  async getMessages(userId) {
    return this.request(`/api/users/${userId}/messages`);
  }

  async getConversations() {
    return this.request("/api/users/conversations/list");
  }

  async updateProfile(name, email) {
    return this.request("/api/users/me", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
  }

  async deleteMessage(messageId) {
    return this.request(`/api/users/messages/${messageId}`, {
      method: "DELETE",
    });
  }

  // Upload endpoints
  async uploadProfilePic(file) {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_URL}/api/upload/profile-pic`;
    const headers = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Upload Error (profile-pic):", error);
      throw error;
    }
  }

  async uploadMediaFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_URL}/api/upload/media`;
    const headers = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Upload Error (media):", error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request("/health");
    } catch (error) {
      console.error("Health check failed:", error);
      return null;
    }
  }
}

export default new APIService();
