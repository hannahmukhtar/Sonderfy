import React, { useState, useEffect } from 'react';
import { FaSpotify } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassCheers, faBookOpen, faMusic, faDumbbell } from '@fortawesome/free-solid-svg-icons';
import "./LandingPage.css"; 

const LandingPage = () => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const text = "Discover Music for Every Moment of Your Life";
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        setDisplayText(text.substring(0, index + 1));
        index++;
        setTimeout(type, 100);
      }
    };
    
    type();
    
    return () => {
      setDisplayText('');
    };
  }, []);

  const handleLogin = () => {
    const clientId = "c0075612d3594ee5ab2d8f5e97152984";
    const redirectUri = "http://localhost:5173/callback";
    const scopes = [
      "user-read-private",
    "playlist-modify-private",
    "playlist-read-private",
    "user-library-read",
    "user-top-read"
    ];
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}`;
    window.location.href = authUrl;
  };


  return (
    <div>
      {/* Title */}
      <div className="title">Sonderfy</div>

      {/* Typing Effect */}
      <div className="typing-effect">{displayText}</div>
      {/* Subtext */}
      <div className="subtext">
        After connecting to your account, click an activity to receive a personalized activity-specific playlist.
      </div>

      {/* Icons for Activities */}
      <div className="icon-container">
        <FontAwesomeIcon icon={faGlassCheers} className="icon" />
        <FontAwesomeIcon icon={faBookOpen} className="icon" />
        <FontAwesomeIcon icon={faMusic} className="icon" />
        <FontAwesomeIcon icon={faDumbbell} className="icon" />
      </div>

      {/* Spotify Login Button */}
      
      <button onClick={handleLogin} className="spotify-button">
        <FaSpotify /> Login with Spotify
      </button>
       

      {/* Example Text */}
      <div className="example-text">
        Example: Studying, Working Out, Vibe, Relax, Party, etc
      </div>

      {/* Footer */}
      <div className="footer">
        Coded by Hannah Mukhtar 모ฅ(•- •マ ྀི
        <br />
        <a href="https://linktr.ee/hannahmukhtar" target="_blank">
          <img className="linktree-icon" src="https://i.imgur.com/qtzqsnh.png" alt="Linktree" />
        </a>
      </div>
    </div>
  );
};

export default LandingPage;


