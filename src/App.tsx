import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";

const checkAuthentication = async () => {
  let token = window.localStorage.getItem("token");
  if (token != null) {
    let newResponse = await fetch("http://localhost:8000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let answer = await newResponse.json();

    if (answer.message == "ok") {
      console.log("HELLLLLLLLKSD");
      return true;
    } else {
      return false;
    }
  }

  return false;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuthentication = async () => {
      try {
        const authenticated = await checkAuthentication();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false); // Set to false if an error occurs
      }
    };

    fetchAuthentication();
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          {isAuthenticated ? console.log("hello") : console.log("bye")}
          <Route
            path="/dashboard"
            render={() =>
              isAuthenticated ? <Dashboard /> : <Redirect to="/" />
            }
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
