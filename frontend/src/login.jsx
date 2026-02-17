import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await window.electronAPI.loginController({
                username,
                password,
            });

            if (!res.success) {
                setError(res.message);
            }

        } catch {
            setError("Login failed");
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
        }

        .loginController-body {
            font-family: 'Inter', sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
        }

        .loginController-body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 30, 80, 0.85), rgba(0, 80, 150, 0.6));
            z-index: 0;
        }

        .loginController-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 45px;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            width: 100%;
            max-width: 400px;
            border-top: 5px solid #0056b3;
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
        }

        .loginController-container:hover {
            transform: translateY(-3px);
        }

        .loginController-container h2 {
            text-align: center;
            margin-bottom: 10px;
            color: #0d253f;
            font-weight: 700;
            font-size: 26px;
        }

        .subtitle {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 35px;
        }

        .form-group {
            margin-bottom: 22px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group input {
            width: 100%;
            padding: 14px;
            border: 2px solid #eef2f7;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 15px;
            transition: all 0.3s ease;
            color: #333;
        }

        .form-group input:focus {
            border-color: #0066cc;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
            outline: none;
            background-color: #fff;
        }

        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(90deg, #004e92, #0066cc);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: transform 0.2s, box-shadow 0.2s;
            text-transform: uppercase;
        }

        button:hover {
            background: linear-gradient(90deg, #003d73, #0056b3);
            box-shadow: 0 6px 15px rgba(0, 78, 146, 0.4);
        }

        button:active {
            transform: translateY(1px);
        }

        .error-message {
            color: #c53030;
            background-color: #fff5f5;
            text-align: center;
            margin-top: 20px;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid #feb2b2;
        }

        .decor-circle {
            position: absolute;
            top: -50px;
            right: -50px;
            width: 100px;
            height: 100px;
            background: rgba(0, 102, 204, 0.05);
            border-radius: 50%;
        }
      `}</style>

            <div className="loginController-body">
                <div className="loginController-container">
                    <div className="decor-circle"></div>

                    <h2>Secure Access</h2>
                    <p className="subtitle">Enter your credentials to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit">Sign In</button>

                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
            </div>
        </>
    );
}
