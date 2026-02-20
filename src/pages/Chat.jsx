import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function Chat() {

  const currentUser = {
    name: "Team Lead",
    role: "Team Lead"
  };

  const members = [
    { name: "Rahul", role: "Frontend Developer", online: true },
    { name: "Priya", role: "Backend Developer", online: true },
    { name: "Arjun", role: "UI/UX Designer", online: false },
    { name: "Sneha", role: "QA Engineer", online: true },
  ];

  const [selectedUser, setSelectedUser] = useState(members[0]);
  const [message, setMessage] = useState("");

  const [conversations, setConversations] = useState({
    Rahul: [
      { id: 1, sender: "Rahul", text: "Good morning!", time: "09:00 AM" }
    ],
    Priya: [
      { id: 2, sender: "Priya", text: "API done!", time: "09:15 AM" }
    ],
    Arjun: [],
    Sneha: []
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedUser]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser.name,
      text: message,
      time: getCurrentTime(),
    };

    setConversations({
      ...conversations,
      [selectedUser.name]: [
        ...conversations[selectedUser.name],
        newMessage
      ],
    });

    setMessage("");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Frontend Developer":
        return "bg-blue-100 text-blue-600";
      case "Backend Developer":
        return "bg-purple-100 text-purple-600";
      case "UI/UX Designer":
        return "bg-pink-100 text-pink-600";
      case "QA Engineer":
        return "bg-green-100 text-green-600";
      case "Team Lead":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex h-[82vh] bg-white rounded-2xl shadow-md border overflow-hidden">

      {/* MEMBERS PANEL */}
      <div className="w-72 bg-gray-50 border-r px-6 py-6">

        <h2 className="text-lg font-semibold mb-6">
          Team Members
        </h2>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={index}
              onClick={() => setSelectedUser(member)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${
                selectedUser.name === member.name
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                  {member.name.charAt(0)}
                </div>

                {member.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {member.name}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleBadgeColor(member.role)}`}
                >
                  {member.role}
                </span>

                <p className="text-xs text-gray-400 mt-1">
                  {member.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="px-8 py-5 border-b bg-white flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {selectedUser.name}
            </h2>

            <div className="flex items-center gap-3 mt-1">
              <span
                className={`text-xs px-3 py-1 rounded-full ${getRoleBadgeColor(selectedUser.role)}`}
              >
                {selectedUser.role}
              </span>

              <p className="text-sm text-gray-500">
                {selectedUser.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 px-8 py-8 overflow-y-auto bg-gray-50">
          {(conversations[selectedUser.name] || []).map((msg) => (
            <div
              key={msg.id}
              className={`mb-6 flex ${
                msg.sender === currentUser.name
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-5 py-4 rounded-2xl shadow-sm ${
                  msg.sender === currentUser.name
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.sender !== currentUser.name && (
                  <p className="text-xs opacity-60 mb-1">
                    {selectedUser.role}
                  </p>
                )}

                <p className="text-sm leading-relaxed">
                  {msg.text}
                </p>

                <p className="text-xs mt-2 text-right opacity-60">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT */}
        <div className="px-8 py-6 bg-white border-t flex items-center gap-4">

          <input
            type="text"
            placeholder={`Message ${selectedUser.name}...`}
            className="flex-1 bg-gray-100 px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-full"
          >
            <Send size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}