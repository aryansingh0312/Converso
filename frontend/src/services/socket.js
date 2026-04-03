import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  // Connect to the socket server
  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Handle connection events
    this.socket.on("connect", () => {
      console.log("✅ Socket connected");
      this.emit("connected");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      this.emit("disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.emit("error", error);
    });
  }

  // Disconnect from socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Register a listener for a custom event
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Also register with socket if connected
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove a listener
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit a custom event
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Chat methods
  sendMessage(to, text, type = "text", fileMetadata = null) {
    this.socket?.emit("send_message", { to, text, type, fileMetadata });
  }

  typingStart(to) {
    this.socket?.emit("typing_start", { to });
  }

  typingStop(to) {
    this.socket?.emit("typing_stop", { to });
  }

  markAsRead(from) {
    this.socket?.emit("message_read", { from });
  }

  deleteMessage(messageId, to) {
    this.socket?.emit("delete_message", { messageId, to });
  }

  deleteMessageForMe(messageId) {
    this.socket?.emit("delete_message_for_me", { messageId });
  }

  deleteMessageForEveryone(messageId, to) {
    this.socket?.emit("delete_message_for_everyone", { messageId, to });
  }

  // WebRTC methods
  callUser(to, offer) {
    this.socket?.emit("call_user", { to, offer });
  }

  acceptCall(to, answer) {
    this.socket?.emit("call_accepted", { to, answer });
  }

  rejectCall(to) {
    this.socket?.emit("call_rejected", { to });
  }

  endCall(to) {
    this.socket?.emit("call_ended", { to });
  }

  sendIceCandidate(to, candidate) {
    this.socket?.emit("ice_candidate", { to, candidate });
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
