import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/login.jsx";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app/*" element={<App />} />
        </Routes>
    </HashRouter>
);
