import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [nonce, setNonce] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/nonce");
        const data = await res.json();
        setNonce(data.nonce);
      } catch (error) {
        console.error("Error fetching nonce:", error);
      }
    };

    fetchData();
  }, []);

  const signMessage = async () => {
    if (!nonce) {
      console.error("Nonce not available.");
      return;
    }

    if (window.ethereum) {
      try {
        // Request account access using eth_requestAccounts

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        // Sign the message using the signer account and the nonce value
        const message = `I am signing this message to prove my identity. Nonce: ${nonce}`;
        const signedMessage = await signer.signMessage(message);
        const data = { signedMessage, message, address };

        console.log(data);
        console.log(JSON.stringify(data));
        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let tokenObject = await response.json();

        await window.localStorage.setItem("token", tokenObject.token);
        console.log(tokenObject);
        const newResponse = await fetch("http://localhost:8000/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenObject.token}`,
          },
        });
        let answer = await newResponse.json();

        if (answer.message == "ok") {
          history.push("/dashboard");
        } else {
          console.log("ridiiii");
        }
      } catch (error) {
        console.error("Error signing message:", error);
      }
    } else {
      console.error("Ethereum provider not found.");
    }
  };

  return (
    <div>
      <h1>Ethers.js Sign Message Example</h1>
      <button onClick={signMessage} disabled={!nonce}>
        Sign Message
      </button>
    </div>
  );
};

export default Home;
