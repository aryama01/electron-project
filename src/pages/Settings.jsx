import { useState } from "react";
import { Save, Upload } from "lucide-react";

export default function Settings() {

  const [profile, setProfile] = useState({
    name: "Team Lead",
    email: "teamlead@company.com",
    phone: "9876543210",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold mb-8">
        Settings
      </h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">

        <h2 className="text-lg font-semibold mb-6">
          Profile Information
        </h2>

        {/* Profile Photo */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-sm border">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              "No Photo"
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-sm">
            <Upload size={16} />
            Upload Photo
            <input
              type="file"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

        </div>
      </div>

      {/* ================= PASSWORD CARD ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">

        <h2 className="text-lg font-semibold mb-6">
          Change Password
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <input
            type="password"
            placeholder="Current Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setPassword({ ...password, current: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setPassword({ ...password, new: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) =>
              setPassword({ ...password, confirm: e.target.value })
            }
          />

        </div>
      </div>

      {/* ================= PREFERENCES CARD ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">

        <h2 className="text-lg font-semibold mb-6">
          Preferences
        </h2>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-500">
              Receive updates about tasks and approvals
            </p>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                notifications ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500">
              Enable dark theme interface
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                darkMode ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* ================= SAVE BUTTON ================= */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

    </div>
  );
}
