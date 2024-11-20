import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get("access_token");

    if (token) {
      localStorage.setItem("spotify_access_token", token);

      setTimeout(() => {
        setLoading(false);
        navigate("/activity");
      }, 1000); 
    } else {
      console.error("Spotify authentication failed.");
      navigate("/"); 
    }
  }, [navigate]);

  return <div>{loading ? "Loading..." : null}</div>;
};

export default Callback;
