import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";

const Loading = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
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
            history.push("/dashboard");
          } else {
            history.push("/Home");
          }
        }

        history.push("/Home");
      };

      fetchData();
    }, 3000);
  }, []);

  return (
    <div style={{ flex: 1, height: 100, width: 100 }}>
      Loading
      <PuffLoader
        color={"blue"}
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
export default Loading;
