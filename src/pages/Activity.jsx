import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./Activity.css"; 

const Activity = () => {
  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();

  if (!token) {
    return <div>Unauthorized! Please log in through Spotify.</div>;
  }

  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) {
        return; 
      }
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert('Token expired, please log in again.');
        localStorage.removeItem('spotify_access_token'); 
        return;
      }
      const data = await response.json();
      setUsername(data.display_name); 
    };

    fetchUserDetails();
  }, [token]);

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

  const handleActivityClick = (activity) => {
    const genresByActivity = {
      workout: [
        "hip-hop",
        "pop",
        "electronic",
        "edm",
        "house",
        "club",
        "dance",
        "dancehall",
        "work-out",
        "hard-rock",
        "progressive-house",
        "hardstyle",
        "trance",
        "techno"
      ],
      relax: [
        "ambient",
        "chill",
        "classical",
        "acoustic",
        "jazz",
        "new-age",
        "piano",
        "guitar",
        "sleep",
        "rainy-day",
        "soul",
        "world-music",
        "folk"
      ],
      study: [
        "study",
        "classical",
        "ambient",
        "chill",
        "acoustic",
        "piano",
        "singer-songwriter",
        "new-age",
        "minimal-techno",
        "soundtracks"
      ],
      party: [
        "pop",
        "dance",
        "dancehall",
        "edm",
        "club",
        "disco",
        "party",
        "house",
        "latin",
        "reggaeton",
        "funk",
        "tropical",
        "power-pop"
      ],
      drive: [
        "road-trip",
        "rock",
        "indie",
        "alt-rock",
        "psychedelic",
        "blues",
        "british",
        "country",
        "folk",
        "guitar",
        "punk",
        "pop"
      ],
      sleep: [
        "ambient",
        "classical",
        "new-age",
        "piano",
        "acoustic",
        "guitar",
        "jazz",
        "chill",
        "rainy-day",
        "singer-songwriter"
      ],
      vibe: [
        "indie",
        "indie-pop",
        "alt-rock",
        "chill",
        "soul",
        "r-n-b",
        "synth-pop",
        "trip-hop",
        "tropical",
        "folk"
      ],
      celebrate: [
        "pop",
        "funk",
        "disco",
        "party",
        "dance",
        "latin",
        "reggaeton",
        "edm",
        "club",
        "power-pop"
      ],
      savedTracks: [],
    };    
  
    const selectedGenres = genresByActivity[activity];
  
    console.log("Navigating with:", {
      activity,
      genres: selectedGenres,
      username,
    });
  
    
    navigate("/playlist", {
      state: {
        activity, 
        genres: selectedGenres, 
        username, 
      },
    });
  };
  

  
  return (
<div>
      <div className="title">Sonderfy</div>
      <div className="typing-effect">{displayText}</div>
      <div className="subtext">
        Welcome <span>{username}</span>! Click an activity below to receive a personalized activity-specific playlist.
      </div>
      <div className="button-container">
        <div className="button-item" id="study">
          <button className="activity-button" onClick={() => handleActivityClick('study')}> 
          <img 
        src="https://i.imgur.com/T5fDDeV.png" 
        alt="Study Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">study</p>
        </div>
        <div className="button-item" id="workout">
          <button className="activity-button" onClick={() => handleActivityClick('workout')}>
          <img 
        src="https://i.imgur.com/fcR30Bt.png" 
        alt="Workout Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">workout</p>
        </div>
        <div className="button-item" id="celebrate">
          <button className="activity-button" onClick={() => handleActivityClick('celebrate')}>
          <img 
        src="https://i.imgur.com/ICC9HyT.png" 
        alt="Celebrate Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">celebrate</p>
        </div>
        <div className="button-item" id="relax">
          <button className="activity-button" onClick={() => handleActivityClick('relax')}>
          <img 
        src="https://i.imgur.com/aqq4F5C.png" 
        alt="Relax Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">relax</p>
        </div>

        <div className="button-item" id="party">
          <button className="activity-button" onClick={() => handleActivityClick('party')}>
          <img 
        src="https://i.imgur.com/ciwqSgz.png" 
        alt="Party Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">party</p>
        </div>
        <div className="button-item" id="drive">
          <button className="activity-button" onClick={() => handleActivityClick('drive')}>
          <img 
        src="https://i.imgur.com/MpavzQH.png" 
        alt="Drive Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">drive</p>
        </div>
        <div className="button-item" id="sleep">
          <button className="activity-button" onClick={() => handleActivityClick('sleep')}>
          <img 
        src="https://i.imgur.com/lEHSQKW.png" 
        alt="Sleep Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">sleep</p>
        </div>
        <div className="button-item" id="vibe">
          <button className="activity-button" onClick={() => handleActivityClick('vibe')}>
          <img 
        src="https://i.imgur.com/RTAQUGW.png" 
        alt="Vibe Icon" 
        className="custom-icon"
        style={{ width: '115px', height: '115px' }} 
      />
          </button>
          <p className="button-subtitle">vibe</p>
        </div>

  <div className="footer">
        Coded by Hannah Mukhtar 모ฅ(•- •マ ྀི
        <br />
        <a href="https://linktr.ee/hannahmukhtar" target="_blank">
          <img className="linktree-icon" src="https://i.imgur.com/qtzqsnh.png" alt="Linktree" />
        </a>
      </div>
      </div>
    </div>
  );
};
export default Activity;
