import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom"; // <-- important

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<HashRouter>
        <App />
    </HashRouter>
);
