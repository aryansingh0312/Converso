import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import socket from "../services/socket";

const NAV = [
  { id: "chats", label: "Chats", icon: <ChatIco /> },
  { id: "calls", label: "Calls", icon: <PhoneIco /> },
  { id: "settings", label: "Settings", icon: <SettingsIco /> },
];

const EMOJIS = ["😀", "😂", "🥰", "😎", "🔥", "💯", "👍", "🎉", "❤️", "✨", "🚀", "💬", "🙌"];

export default function DashboardPage({ onLogout, user, onNavigate }) {
  // State
  const [view, setView] = useState("chats");
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [convSearch, setConvSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [settings, setSettings] = useState({ notifications: true, sounds: true, readReceipts: true });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { messageId, mode: "me" | "everyone" }
  
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Update current user when user prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Get active conversation
  const activeConv = conversations.find(c => c.user._id === activeConvId);
  const activeMessages = messages[activeConvId] || [];

  // Filter conversations
  const filteredConvs = conversations.filter(c =>
    c.user.name.toLowerCase().includes(convSearch.toLowerCase())
  );

  // Load initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Get all conversations
        const convData = await api.getConversations();
        setConversations(convData);
        
        // Get all users for new chat
        const usersData = await api.getAllUsers();
        setUsers(usersData);

        // Set first conversation as active if exists
        if (convData.length > 0) {
          setActiveConvId(convData[0].user._id);
        }

        setError("");
      } catch (err) {
        const errorMsg = "Failed to load conversations";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "bottom-right",
          autoClose: 3000,
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConvId) return;
      try {
        const msgs = await api.getMessages(activeConvId);
        setMessages(prev => ({ ...prev, [activeConvId]: msgs }));
        
        // Emit read receipt when viewing messages
        socket.emit("message_read", { from: activeConvId });
      } catch (err) {
        console.error("Failed to load messages:", err);
        toast.error("Failed to load messages", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };

    loadMessages();
  }, [activeConvId]);

  // Setup Socket.io connections
  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socket.connect(localStorage.getItem("token"));

    // Listen for new messages
    const handleNewMessage = (msg) => {
      // Determine conversation ID based on who sent the message
      // Convert ObjectIds to strings for proper comparison
      const fromId = typeof msg.from === 'object' ? msg.from._id.toString() : msg.from;
      const toId = typeof msg.to === 'object' ? msg.to._id.toString() : msg.to;
      const userId = user._id.toString();
      const convId = fromId === userId ? toId : fromId;
      
      console.log("💬 New message received:", { from: fromId, to: toId, userId, convId, text: msg.text });
      
      setMessages(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), msg],
      }));
    };

    // Listen for delivery status
    const handleMessageDelivered = ({ messageId, status, deliveredAt }) => {
      console.log("📦 Message delivered:", messageId);
      setMessages(prev => {
        const updated = { ...prev };
        for (const convId in updated) {
          updated[convId] = updated[convId].map(msg =>
            msg._id === messageId ? { ...msg, status, deliveredAt } : msg
          );
        }
        return updated;
      });
    };

    // Listen for seen/read status
    const handleMessagesSeen = ({ by, from }) => {
      console.log("👁️ Messages seen by:", by);
      setMessages(prev => {
        const convId = by.toString();
        const updated = { ...prev };
        if (updated[convId]) {
          updated[convId] = updated[convId].map(msg =>
            msg.from._id?.toString() === user._id.toString() ? 
              { ...msg, status: "seen", readAt: new Date() } : msg
          );
        }
        return updated;
      });
    };

    // Listen for deleted messages
    const handleMessageDeleted = ({ messageId }) => {
      console.log("🗑️ Message deleted:", messageId);
      setMessages(prev => {
        const updated = { ...prev };
        for (const convId in updated) {
          updated[convId] = updated[convId].filter(msg => msg._id !== messageId);
        }
        return updated;
      });
    };

    const handleMessageDeletedForMe = ({ messageId }) => {
      console.log("🗑️ Message deleted for me:", messageId);
      setMessages(prev => {
        const updated = { ...prev };
        for (const convId in updated) {
          updated[convId] = updated[convId].filter(msg => msg._id !== messageId);
        }
        return updated;
      });
    };

    const handleMessageDeletedForEveryone = ({ messageId }) => {
      console.log("🗑️ Message deleted for everyone:", messageId);
      setMessages(prev => {
        const updated = { ...prev };
        for (const convId in updated) {
          updated[convId] = updated[convId].filter(msg => msg._id !== messageId);
        }
        return updated;
      });
    };

    // Listen for online status changes
    const handleUserOnline = ({ userId }) => {
      setConversations(prev => 
        prev.map(c => 
          c.user._id === userId ? { ...c, user: { ...c.user, online: true } } : c
        )
      );
    };

    const handleUserOffline = ({ userId }) => {
      setConversations(prev =>
        prev.map(c =>
          c.user._id === userId ? { ...c, user: { ...c.user, online: false } } : c
        )
      );
    };

    // Listen for profile updates
    const handleUserProfileUpdated = ({ userId, profilePic, name, avatar }) => {
      setConversations(prev => 
        prev.map(c => 
          c.user._id === userId ? { ...c, user: { ...c.user, profilePic, name, avatar } } : c
        )
      );
      // Also update messages with the new user data
      setMessages(prevMessages => {
        const updated = { ...prevMessages };
        for (const key in updated) {
          updated[key] = updated[key].map(msg => ({
            ...msg,
            from: msg.from._id === userId ? { ...msg.from, profilePic, name, avatar } : msg.from,
            to: msg.to._id === userId ? { ...msg.to, profilePic, name, avatar } : msg.to,
          }));
        }
        return updated;
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_deleted_for_me", handleMessageDeletedForMe);
    socket.on("message_deleted_for_everyone", handleMessageDeletedForEveryone);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("user_profile_updated", handleUserProfileUpdated);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_deleted_for_me", handleMessageDeletedForMe);
      socket.off("message_deleted_for_everyone", handleMessageDeletedForEveryone);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("user_profile_updated", handleUserProfileUpdated);
    };
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !activeConvId) return;

    socket.sendMessage(activeConvId, message.trim(), "text");
    setMessage("");
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;

    try {
      setUploading(true);
      setUploadProgress(10);
      toast.info(`Uploading ${file.name}...`, {
        position: "bottom-right",
        autoClose: false,
      });
      
      const response = await api.uploadMediaFile(file);
      setUploadProgress(100);
      
      // Send message with file URL and metadata
      // type is determined by backend (image or file)
      socket.sendMessage(activeConvId, response.url, response.type, {
        fileName: response.name,
        fileType: response.mimeType,
        fileSize: response.size,
      });

      toast.success("File sent!", {
        position: "bottom-right",
        autoClose: 2000,
      });

      setMessage("");
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        fileInputRef.current.value = "";
      }, 500);
    } catch (err) {
      console.error("File upload failed:", err);
      setUploading(false);
      setUploadProgress(0);
      toast.error("Failed to upload file. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      fileInputRef.current.value = "";
    }
  };

  // Delete message
  const handleDeleteMessage = (messageId) => {
    setDeleteConfirm({ messageId, mode: "me" });
  };

  const handleDeleteMessageForMe = (messageId) => {
    socket.deleteMessageForMe(messageId);
    toast.info("Message deleted for you", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleDeleteMessageForEveryone = (messageId) => {
    setDeleteConfirm({ messageId, mode: "everyone" });
  };

  // Start new chat
  const startChat = async (userId) => {
    // If conversation doesn't exist, create it from users list
    if (!conversations.find(c => c.user._id === userId)) {
      const selectedUser = users.find(u => u._id === userId);
      if (selectedUser) {
        const newConv = {
          user: selectedUser,
          lastMessage: "",
          lastMessageTime: new Date(),
          unreadCount: 0,
        };
        setConversations(prev => [newConv, ...prev]);
      }
    }
    setActiveConvId(userId);
    setModal(null);
  };

  // Handle logout
  const handleLogout = () => {
    toast.info("Logging out...", {
      position: "bottom-right",
      autoClose: 1500,
    });
    socket.disconnect();
    api.logout();
    onLogout?.();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgba(200,210,240,0.6)]">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090f] overflow-hidden">
      {/* ── Icon Rail ── */}
      <aside className="hidden sm:flex flex-col items-center justify-between w-16 h-full bg-[rgba(12,12,24,0.95)] border-r border-white/[0.06] py-4 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onNavigate("home")}
            title="Home"
            className="flex w-8 h-8 mb-4 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)] hover:scale-110 transition-transform cursor-pointer border-none bg-transparent p-0"
          >
            <BubbleIco />
          </button>
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              title={label}
              onClick={() => setView(id)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border-none cursor-pointer ${
                view === id ? "bg-[rgba(99,102,241,0.2)] text-[#a78bfa]" : "bg-transparent text-[rgba(200,210,240,0.4)] hover:text-[#e0e0f8] hover:bg-white/[0.06]"
              }`}
            >
              <span className="w-[18px] h-[18px] flex">{icon}</span>
              {view === id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />}
            </button>
          ))}
        </div>
        <button
          title="Edit Profile"
          onClick={() => setShowProfileModal(true)}
          className="relative w-9 h-9 rounded-full border-2 border-[rgba(99,102,241,0.4)] hover:border-[#818cf8] transition-all cursor-pointer bg-transparent p-0 overflow-hidden hover:scale-110"
        >
          <img src={currentUser?.profilePic || currentUser?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"} alt="Me" className="w-full h-full rounded-full" />
          <span className={`absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full border-2 border-[rgba(12,12,24,0.95)] ${socket.isConnected() ? "bg-[#22c55e]" : "bg-gray-500"}`} />
        </button>
      </aside>

      {/* ── Main Content ── */}
      {view === "settings" ? (
        <SettingsView settings={settings} setSettings={setSettings} user={user} onLogout={handleLogout} />
      ) : (
        <>
          {/* Conversation Sidebar */}
          <aside className="flex flex-col w-[300px] shrink-0 border-r border-white/[0.06] bg-[rgba(10,10,20,0.7)]">
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
              <h2 className="font-heading text-[1rem] font-bold text-[#f0f0ff]">Messages</h2>
              <button
                title="New chat"
                onClick={() => setModal("newchat")}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#a78bfa] border border-[rgba(99,102,241,0.25)] bg-[rgba(99,102,241,0.12)] cursor-pointer hover:bg-[rgba(99,102,241,0.25)] transition-all"
              >
                <span className="w-4 h-4 flex">+</span>
              </button>
            </div>

            <div className="px-4 pb-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[rgba(200,210,240,0.3)] flex">🔍</span>
                <input
                  value={convSearch}
                  onChange={e => setConvSearch(e.target.value)}
                  type="search"
                  placeholder="Search…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#e0e0f8] text-[0.8rem] placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.4)] transition-all caret-[#818cf8]"
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto list-none m-0 p-0 flex flex-col gap-[2px] px-2">
              {filteredConvs.length > 0 ? (
                filteredConvs.map(conv => (
                  <li key={conv.user._id}>
                    <button
                      onClick={() => setActiveConvId(conv.user._id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-none cursor-pointer text-left transition-all ${
                        activeConvId === conv.user._id ? "bg-[rgba(99,102,241,0.15)]" : "bg-transparent hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.user.profilePic || conv.user.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"}
                          alt={conv.user.name}
                          className="w-10 h-10 rounded-full bg-[#1e1e3a] border border-white/[0.08]"
                        />
                        {conv.user.online && <span className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-[#22c55e] border-2 border-[rgba(10,10,20,0.95)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.85rem] font-semibold text-[#e0e0f8] truncate">{conv.user.name}</span>
                          <span className="text-[0.7rem] text-[rgba(200,210,240,0.4)] shrink-0 ml-2">{conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[0.75rem] text-[rgba(200,210,240,0.45)] truncate">{conv.lastMessage || "No messages yet"}</span>
                          {conv.unreadCount > 0 && (
                            <span className="shrink-0 ml-2 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[0.6rem] font-bold flex items-center justify-center">{conv.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-center h-40 text-[rgba(200,210,240,0.4)] text-sm">No conversations yet</li>
              )}
            </ul>
          </aside>

          {/* Chat Area */}
          {activeConv ? (
            <main className="flex flex-col flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[rgba(10,10,20,0.5)] backdrop-blur-sm shrink-0">
                <img
                  src={activeConv.user.profilePic || activeConv.user.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"}
                  alt=""
                  className="w-9 h-9 rounded-full bg-[#1e1e3a] border border-white/[0.08]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[0.9rem] font-semibold text-[#f0f0ff] leading-tight">{activeConv.user.name}</p>
                  <p className="text-[0.72rem]">
                    {activeConv.user.online ? (
                      <span className="text-[#22c55e]">● Online</span>
                    ) : (
                      <span className="text-[rgba(200,210,240,0.45)]">Offline</span>
                    )}
                  </p>
                </div>
                <button onClick={() => setShowInfo(!showInfo)} className="flex items-center justify-center w-9 h-9 rounded-xl border-none bg-transparent text-[rgba(200,210,240,0.45)] hover:text-[#e0e0f8] hover:bg-white/[0.06] cursor-pointer transition-all">
                  <span className="w-[17px] h-[17px] flex">ℹ️</span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowX: 'hidden' }}>
                {activeMessages.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-white/[0.05]" />
                      <span className="text-[0.7rem] text-[rgba(200,210,240,0.35)]">Today</span>
                      <div className="flex-1 h-px bg-white/[0.05]" />
                    </div>
                    {activeMessages.map(msg => (
                      <div key={msg._id} className={`flex gap-2 items-end group ${msg.from._id === user._id ? "flex-row-reverse" : ""}`}>
                        {msg.from._id !== user._id && (
                          <img
                            src={msg.from.profilePic || msg.from.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"}
                            alt=""
                            className="w-7 h-7 rounded-full bg-[#1e1e3a] border border-white/[0.08] shrink-0 mb-1"
                          />
                        )}
                        <div className={`flex flex-col gap-1 max-w-[65%] ${msg.from._id === user._id ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-[0.875rem] leading-relaxed transition-all ${
                              msg.from._id === user._id
                                ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-br-[6px] shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                                : "bg-white/[0.05] border border-white/[0.08] text-[#dde1f8] rounded-bl-[6px]"
                            }`}
                          >
                            {msg.type === "file" ? (
                              <a
                                href={msg.text}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-2 hover:underline"
                              >
                                <span className="text-lg">📎</span>
                                <div>
                                  <div className="font-semibold">{msg.fileMetadata?.fileName || "File"}</div>
                                  <div className="text-xs opacity-75">
                                    {msg.fileMetadata?.fileSize ? `${(msg.fileMetadata.fileSize / 1024 / 1024).toFixed(2)}MB` : ""}
                                  </div>
                                </div>
                              </a>
                            ) : msg.type === "image" ? (
                              <a href={msg.text} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={msg.text}
                                  alt="Shared image"
                                  className="max-w-[300px] max-h-[300px] rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              </a>
                            ) : (
                              msg.text
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[0.65rem] text-[rgba(200,210,240,0.3)]">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {msg.from._id === user._id && (
                              <span className={`text-[0.65rem] ${msg.status === "seen" ? "text-blue-400" : "text-[rgba(200,210,240,0.3)]"}`}>
                                {msg.status === "seen" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === msg._id ? null : msg._id);
                            }}
                            className="p-1.5 hover:bg-white/[0.1] rounded-full transition-colors shrink-0 flex items-center justify-center"
                            title="Message options"
                          >
                            <span className="text-xl leading-none">⋯</span>
                          </button>
                          {openMenuId === msg._id && (
                            <div className="absolute right-0 top-8 w-48 bg-[#1a1a2e] border border-white/[0.1] rounded-lg shadow-lg z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              {msg.from._id === user._id && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMessageForMe(msg._id);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-amber-400 hover:bg-amber-500/[0.1] transition-colors flex items-center gap-2 border-none cursor-pointer bg-transparent"
                                  >
                                    <span>🗑️</span> Delete for me
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMessageForEveryone(msg._id);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/[0.1] transition-colors flex items-center gap-2 border-none cursor-pointer bg-transparent"
                                  >
                                    <span>🗑️</span> Delete for everyone
                                  </button>
                                </>
                              )}
                              {msg.from._id !== user._id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessageForMe(msg._id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-amber-400 hover:bg-amber-500/[0.1] transition-colors flex items-center gap-2 border-none cursor-pointer bg-transparent"
                                >
                                  <span>🗑️</span> Delete for me
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-50">
                    <span className="text-4xl">💬</span>
                    <p className="text-sm text-[rgba(200,210,240,0.6)]">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.06] bg-[rgba(10,10,20,0.5)] backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] focus-within:border-[rgba(99,102,241,0.4)] transition-all">
                  <button
                    title="Emoji"
                    onClick={() => setModal(modal === "emoji" ? null : "emoji")}
                    className={`border-none cursor-pointer transition-colors p-0 flex items-center justify-center ${modal === "emoji" ? "text-[#a78bfa]" : "text-[rgba(200,210,240,0.35)] hover:text-[#a78bfa]"}`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">😊</span>
                  </button>
                  <button
                    title="Share file"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`border-none cursor-pointer transition-colors p-0 flex items-center justify-center ${uploading ? "opacity-50 cursor-not-allowed" : "text-[rgba(200,210,240,0.35)] hover:text-[#a78bfa]"}`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">📎</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept="*/*"
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                  <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={`Message ${activeConv.user.name}…`}
                    className="flex-1 bg-transparent border-none outline-none text-[0.875rem] text-[#e0e0f8] placeholder:text-[rgba(180,190,230,0.3)] caret-[#818cf8]"
                  />
                  <button
                    title="Send"
                    onClick={sendMessage}
                    disabled={!message.trim() || uploading}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-none cursor-pointer shadow-[0_3px_10px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_14px_rgba(99,102,241,0.55)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <span className="w-4 h-4 flex">→</span>
                  </button>
                </div>

                {/* Upload progress */}
                {uploading && (
                  <div className="mt-2 p-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4 flex items-center justify-center text-xs">📤</span>
                      <span className="text-xs text-[rgba(200,210,240,0.6)]">Uploading...</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.1] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Emoji picker */}
                {modal === "emoji" && (
                  <div className="mt-2 p-3 rounded-2xl bg-[rgba(18,18,38,0.98)] border border-white/[0.08] grid grid-cols-10 gap-1.5">
                    {EMOJIS.map(e => (
                      <button
                        key={e}
                        onClick={() => {
                          setMessage(m => m + e);
                          setModal(null);
                        }}
                        className="text-xl hover:bg-white/[0.06] rounded-lg p-0.5 border-none cursor-pointer bg-transparent transition-all hover:scale-110"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-center text-[0.65rem] text-[rgba(200,210,240,0.25)] mt-2">End-to-end encrypted · Enter to send</p>
              </div>
            </main>
          ) : (
            <main className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-2">💬</p>
                <p className="text-[rgba(200,210,240,0.6)]">Select a conversation or start a new one</p>
              </div>
            </main>
          )}

          {/* Info Panel */}
          {showInfo && activeConv && (
            <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-l border-white/[0.06] bg-[rgba(10,10,20,0.6)] py-6 px-5 gap-5 overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-center">
                <img src={activeConv.user.profilePic || activeConv.user.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"} alt="" className="w-16 h-16 rounded-full bg-[#1e1e3a] border-2 border-[rgba(99,102,241,0.35)]" />
                <div>
                  <p className="font-heading text-[0.95rem] font-bold text-[#f0f0ff]">{activeConv.user.name}</p>
                  <p className="text-[0.75rem] text-[rgba(200,210,240,0.5)]">{activeConv.user.email}</p>
                </div>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex flex-col gap-3">
                <p className="text-[0.7rem] font-semibold text-[rgba(200,210,240,0.4)] uppercase tracking-widest">Status</p>
                <div className="flex justify-between">
                  <span className="text-[0.78rem] text-[rgba(200,210,240,0.45)]">Status</span>
                  <span className="text-[0.78rem] text-[#e0e0f8] font-medium">{activeConv.user.online ? "Online" : "Offline"}</span>
                </div>
              </div>
            </aside>
          )}
        </>
      )}

      {/* ── New Chat Modal ── */}
      {modal === "newchat" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="w-96 rounded-2xl bg-[#141428] border border-white/[0.1] p-6">
            <h2 className="font-heading text-xl font-bold text-[#f0f0ff] mb-4">Start new chat</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.filter(u => u._id !== user._id).map(u => (
                <button
                  key={u._id}
                  onClick={() => startChat(u._id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all border-none cursor-pointer text-left"
                >
                  <img src={u.profilePic || u.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-[#e0e0f8]">{u.name}</p>
                    <p className="text-xs text-[rgba(200,210,240,0.5)]">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center" onClick={() => setShowProfileModal(false)}>
          <div className="w-full max-w-md bg-[rgba(10,10,20,0.95)] border border-white/[0.1] rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-[#f0f0ff]">Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[rgba(200,210,240,0.5)] hover:text-[#e0e0f8] text-2xl leading-none border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ProfileEditSection user={currentUser} onUserUpdate={setCurrentUser} onClose={() => setShowProfileModal(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Delete Message Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm bg-[rgba(10,10,20,0.95)] border border-white/[0.1] rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#f0f0ff]">Delete message?</h3>
            </div>
            
            <p className="text-sm text-[rgba(200,210,240,0.6)] mb-6">
              {deleteConfirm.mode === "everyone" 
                ? "This will remove the message for all participants." 
                : "This will only delete it from your chat."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg bg-white/[0.04] text-[rgba(200,210,240,0.7)] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.mode === "everyone") {
                    socket.deleteMessageForEveryone(deleteConfirm.messageId, activeConvId);
                    toast.info("Message deleted for everyone", {
                      position: "bottom-right",
                      autoClose: 2000,
                    });
                  } else {
                    socket.deleteMessageForMe(deleteConfirm.messageId);
                    toast.info("Message deleted for you", {
                      position: "bottom-right",
                      autoClose: 2000,
                    });
                  }
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings View Component
function SettingsView({ settings, setSettings, user, onLogout }) {
  const [profileUploading, setProfileUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const profileFileInputRef = useRef(null);

  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProfileUploading(true);
      const response = await api.uploadProfilePic(file);
      
      // Broadcast profile update to other users
      socket.emit("profile_updated", {
        profilePic: response.profilePic,
        name: user.name,
        avatar: user.avatar
      });
      
      toast.success("Profile picture updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      toast.error("Failed to upload profile picture. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setProfileUploading(false);
      profileFileInputRef.current.value = "";
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileError("Name and email are required");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileError("");
      setProfileSuccess("");
      
      const updatedUser = await api.updateProfile(profileForm.name.trim(), profileForm.email.trim());
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setProfileSuccess("Profile updated successfully!");
      setEditingProfile(false);
      
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({ name: user?.name || "", email: user?.email || "" });
    setProfileError("");
    setEditingProfile(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(10,10,20,0.7)] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="font-heading text-xl font-bold text-[#f0f0ff] mb-6">Settings</h2>
        
        {/* Profile Section */}
        <div className="mb-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={user?.profilePic || user?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border border-white/[0.1]" 
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#e0e0f8]">{user?.name}</p>
              <p className="text-xs text-[rgba(200,210,240,0.5)]">{user?.email}</p>
            </div>
          </div>

          {!editingProfile ? (
            <>
              {/* Edit Profile Button */}
              <button
                onClick={() => setEditingProfile(true)}
                className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer font-medium mb-3 text-sm"
              >
                ✏️ Edit Profile
              </button>

              {/* Upload Profile Picture Button */}
              <button
                onClick={() => profileFileInputRef.current?.click()}
                disabled={profileUploading}
                className={`w-full py-2 rounded-lg border border-indigo-500/30 text-indigo-400 transition-all cursor-pointer font-medium flex items-center justify-center gap-2 text-sm ${
                  profileUploading
                    ? "bg-indigo-500/10 opacity-50 cursor-not-allowed"
                    : "bg-indigo-500/20 hover:bg-indigo-500/30"
                }`}
              >
                <span>{profileUploading ? "📤" : "📷"}</span>
                {profileUploading ? "Uploading..." : "Upload Picture"}
              </button>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <form onSubmit={handleEditProfile} className="space-y-3">
                <div>
                  <label className="block text-xs text-[rgba(200,210,240,0.6)] mb-1.5">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.4)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[rgba(200,210,240,0.6)] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.4)] transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex-1 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-2 rounded-lg bg-white/[0.04] text-[rgba(200,210,240,0.7)] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}

          <input
            ref={profileFileInputRef}
            type="file"
            onChange={handleProfilePictureUpload}
            accept="image/*"
            disabled={profileUploading}
            style={{ display: "none" }}
          />
          <p className="text-xs text-[rgba(200,210,240,0.4)] mt-3">Max 5MB for profile picture</p>
        </div>

        {/* Settings Toggles */}
        <div className="space-y-4 mb-6">
          <p className="text-xs font-semibold text-[rgba(200,210,240,0.4)] uppercase tracking-widest">Preferences</p>
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggle(key)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <span className="text-sm text-[rgba(200,210,240,0.7)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Profile Edit Section Component (for modal)
function ProfileEditSection({ user, onUserUpdate, onClose, onLogout }) {
  const [profileUploading, setProfileUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const profileFileInputRef = useRef(null);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProfileUploading(true);
      const response = await api.uploadProfilePic(file);
      
      // Update user object with new profile picture
      const updatedUser = { ...user, profilePic: response.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      // Broadcast profile update to other users
      socket.emit("profile_updated", {
        profilePic: response.profilePic,
        name: user.name,
        avatar: user.avatar
      });
      
      toast.success("Profile picture updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      profileFileInputRef.current.value = "";
      setProfileError("");
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      toast.error("Failed to upload profile picture. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      profileFileInputRef.current.value = "";
    } finally {
      setProfileUploading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error("Name and email are required", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setProfileSaving(true);
      setProfileError("");
      
      const updatedUser = await api.updateProfile(profileForm.name.trim(), profileForm.email.trim());
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      toast.success("Profile updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setEditingProfile(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error(err.message || "Failed to update profile", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({ name: user?.name || "", email: user?.email || "" });
    setProfileError("");
    setEditingProfile(false);
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
        <img 
          src={user?.profilePic || user?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=User"} 
          alt="Profile" 
          className="w-16 h-16 rounded-full border border-white/[0.1]" 
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#e0e0f8]">{user?.name}</p>
          <p className="text-xs text-[rgba(200,210,240,0.5)]">{user?.email}</p>
        </div>
      </div>

      {!editingProfile ? (
        <>
          {/* Edit Profile Button */}
          <button
            onClick={() => setEditingProfile(true)}
            className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer font-medium text-sm"
          >
            ✏️ Edit Profile
          </button>

          {/* Upload Profile Picture Button */}
          <button
            onClick={() => profileFileInputRef.current?.click()}
            disabled={profileUploading}
            className={`w-full py-2 rounded-lg border border-indigo-500/30 text-indigo-400 transition-all cursor-pointer font-medium flex items-center justify-center gap-2 text-sm ${
              profileUploading
                ? "bg-indigo-500/10 opacity-50 cursor-not-allowed"
                : "bg-indigo-500/20 hover:bg-indigo-500/30"
            }`}
          >
            <span>{profileUploading ? "📤" : "📷"}</span>
            {profileUploading ? "Uploading..." : "Upload Picture"}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer font-medium text-sm"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {/* Edit Form */}
          <form onSubmit={handleEditProfile} className="space-y-3">
            <div>
              <label className="block text-xs text-[rgba(200,210,240,0.6)] mb-1.5">Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.4)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-[rgba(200,210,240,0.6)] mb-1.5">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.4)] transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="flex-1 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-2 rounded-lg bg-white/[0.04] text-[rgba(200,210,240,0.7)] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      <input
        ref={profileFileInputRef}
        type="file"
        onChange={handleProfilePictureUpload}
        accept="image/*"
        disabled={profileUploading}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ══ SVG Icons ══ */
function BubbleIco() { return <svg viewBox="0 0 32 32" fill="none" className="w-full h-full"><circle cx="16" cy="16" r="15" fill="url(#gdb)"/><path d="M8 12h16M8 17h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/><defs><linearGradient id="gdb" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>; }
function ChatIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function PhoneIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function SettingsIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function EditIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>; }
function SearchIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function InfoIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>; }
function VideoIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>; }
function PlusIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function SendIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function EmojiIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>; }
function BlockIco() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4.93 4.93l14.14 14.14"/></svg>; }
