import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const [loading, setLoading] = useState(true); // Tracks the loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access token from the URL hash
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get("access_token");

    if (token) {
      // Store the token in localStorage
      localStorage.setItem("spotify_access_token", token);

      // Simulate a brief delay and redirect to /activity
      setTimeout(() => {
        setLoading(false);
        navigate("/activity");
      }, 1000); // Optional: delay for smooth transition
    } else {
      console.error("Spotify authentication failed.");
      navigate("/"); // Redirect back to the home page on failure
    }
  }, [navigate]);

  // Display a loading screen while processing
  return <div>{loading ? "Loading..." : null}</div>;
};

export default Callback;
