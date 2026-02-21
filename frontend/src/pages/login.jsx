import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiclients";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            console.log("Attempting login with:", { email, password: "********" });
            const data = await apiClient.login({ email, password });
            console.log(data);


            if ( data.success) {
                console.log("✅ [Login] Login successful");

                // 🔐 Store JWT + user info
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("userId", data.userId);

                console.log("📌 [Login] Token stored in localStorage");
                console.log("📌 Token preview:", data.token.substring(0, 50) + "...");
                console.log("📌 User data:", { role: data.role, userId: data.id });

                // Enter SPA
                navigate("/app/", { replace: true });




            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(true);
        }
    };

    return (
        <div
            style={{
                fontFamily: "'Inter', sans-serif",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(135deg, rgba(0,30,80,0.85), rgba(0,80,150,0.6))",
                    zIndex: 0,
                }}
            />

            {/* Login container */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    background: "rgba(255,255,255,0.95)",
                    padding: "45px",
                    borderRadius: "12px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                    width: "100%",
                    maxWidth: "400px",
                    borderTop: "5px solid #0056b3",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        color: "#0d253f",
                        marginBottom: "10px",
                        fontWeight: 700,
                        fontSize: "26px",
                    }}
                >
                    Secure Access
                </h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "35px",
                    }}
                >
                    Enter your credentials to continue
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "22px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600 }}>
                            Email
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your username"
                            style={{
                                width: "100%",
                                padding: "14px",
                                border: "2px solid #eef2f7",
                                borderRadius: "6px",
                                fontSize: "15px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "22px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{
                                width: "100%",
                                padding: "14px",
                                border: "2px solid #eef2f7",
                                borderRadius: "6px",
                                fontSize: "15px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "16px",
                            background: "linear-gradient(90deg, #004e92, #0066cc)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Sign In
                    </button>

                    {error && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "12px",
                                background: "#fff5f5",
                                color: "#c53030",
                                borderRadius: "6px",
                                textAlign: "center",
                                border: "1px solid #feb2b2",
                            }}
                        >
                            Invalid credentials. Please try again.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;