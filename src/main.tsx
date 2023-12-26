import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import Signup from "./components/Signup.tsx";

if (document.cookie.indexOf("user_id") === -1) {
  document.cookie = `opengpts_user_id=${crypto.randomUUID()}`;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
