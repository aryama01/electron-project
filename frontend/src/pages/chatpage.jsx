import { useState, useRef, useEffect } from "react";
import { Send, Phone, Users, Search, MoreVertical } from "lucide-react";
import { connectWS, sendWS } from "../services/wsClient";
import apiclients from "../utils/apiclients";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchParticipants, setSearchParticipants] = useState("");
  const messagesEndRef = useRef(null);

  // 🔽 Auto scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // 🔥 1. Load logged-in user from localStorage + Connect WebSocket (ONLY ONCE)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.warn("No user found in localStorage");
      return;
    }

    const user = JSON.parse(storedUser);
    setCurrentUser(user);

    // Connect WebSocket with real userId (matches your backend register event)
    connectWS(user.id, {
      onChat: (data) => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: data.text,
            sender: data.sender || "Employee",
            time: new Date(
                data.timestamp || Date.now()
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSystem: false,
          },
        ]);
      },
      onPresence: (data) => {
        // Optional: update online status dynamically
        setParticipants((prev) =>
            prev.map((p) =>
                p._id === data.userId ? { ...p, online: data.status === "online" } : p
            )
        );
      },
    });
  }, []);

  // 🔥 2. Fetch Employees, Teams & Chat History
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all employees
        const empRes = await apiclients.get("/employees");
        const employees = empRes.data || [];

        // Normalize employee data for UI
        const formattedEmployees = employees.map((emp) => ({
          id: emp._id || emp.id,
          name: emp.name || emp.fullName,
          avatar: (emp.name || emp.fullName || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
          online: emp.online || false,
        }));

        setParticipants(formattedEmployees);

        // Fetch teams
        const teamRes = await apiclients.get("/teams");
        setTeams(teamRes.data || []);

        // Fetch previous chat history
        const chatRes = await apiclients.get("/chats/history");
        const history = chatRes.data || [];

        const formattedMessages = history.map((msg) => ({
          id: msg._id || crypto.randomUUID(),
          text: msg.text,
          sender: msg.senderName || msg.sender || "Employee",
          time: new Date(msg.createdAt || Date.now()).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
          ),
          isSystem: false,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load chat data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // 🔥 3. Send Message (WebSocket + Optimistic UI)
  const sendMessage = () => {
    if (!message.trim() || !currentUser) return;

    const payload = {
      type: "chat", // Must match your backend switch case
      text: message,
      sender: currentUser.name,
      userId: currentUser.id,
      teamId: currentUser.teamId || null, // for team chat support
      timestamp: Date.now(),
    };

    // Send to WebSocket microservice
    sendWS(payload);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: message,
        sender: currentUser.name,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: false,
      },
    ]);

    setMessage("");
  };

  // 🔎 Filter participants (search)
  const filteredParticipants = participants.filter((p) =>
      p.name?.toLowerCase().includes(searchParticipants.toLowerCase())
  );

  // 🎨 Dynamic avatar color generator
  const getAvatarColor = (name = "U") => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
      <div className="flex h-full rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {teams?.[0]?.name || "Team Chat"}
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  {participants.filter((p) => p.online).length} members online
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                  <Phone size={20} />
                </button>
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">
                      No messages yet
                    </p>
                    <p className="text-sm">
                      Start a conversation by typing below
                    </p>
                  </div>
                </div>
            ) : (
                messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.sender === currentUser?.name
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                      <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              msg.sender === currentUser?.name
                                  ? "bg-blue-600 text-white rounded-br-none"
                                  : msg.isSystem
                                      ? "bg-gray-200 text-gray-700 rounded-tl-none text-center text-sm"
                                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                          }`}
                      >
                        {!msg.isSystem && (
                            <div className="text-xs font-semibold opacity-75 mb-1">
                              {msg.sender}
                            </div>
                        )}
                        <p className="break-words">{msg.text}</p>
                        <div
                            className={`text-xs mt-1 ${
                                msg.sender === currentUser?.name
                                    ? "text-blue-100"
                                    : "text-gray-500"
                            }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4 shadow-lg">
            <div className="flex gap-3">
              <input
                  type="text"
                  className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (sendMessage(), e.preventDefault())
                  }
              />
              <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                <Send size={18} />
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Participants Sidebar */}
        <div className="w-80 border-l bg-gradient-to-b from-gray-50 to-white flex flex-col shadow-inner">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Participants
              </h2>
              <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {participants.length}
            </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
              />
              <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={searchParticipants}
                  onChange={(e) => setSearchParticipants(e.target.value)}
              />
            </div>
          </div>

          {/* Participants List */}
          <div className="flex-1 overflow-y-auto p-3">
            {filteredParticipants.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No participants found
                </p>
            ) : (
                filteredParticipants.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2"
                    >
                      <div
                          className={`${getAvatarColor(
                              p.name
                          )} text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm relative`}
                      >
                        {p.avatar}
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                p.online ? "bg-green-500" : "bg-gray-400"
                            }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.online ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-blue-50">
            <p className="text-xs text-gray-600 text-center">
              {participants.filter((p) => p.online).length} active •{" "}
              {participants.filter((p) => !p.online).length} away
            </p>
          </div>
        </div>
      </div>
  );
}