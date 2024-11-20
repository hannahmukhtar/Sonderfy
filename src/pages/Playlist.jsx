import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Playlist.css";

const Playlist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activity, username, genres } = location.state || {};

  console.log("Received State:", { activity, genres, username });

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("spotify_access_token");
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [usedRecommendations, setUsedRecommendations] = useState(new Set());
  const [playlistId, setPlaylistId] = useState(null);
  const [shareLink, setShareLink] = useState(null);

  const getAudioFeatures = (activity) => {
    switch (activity) {
      case 'study':
        return {
          min_instrumentalness: 0.3,
          max_energy: 0.6,
          target_tempo: 115,
          max_valence: 0.6
        };
      case 'workout':
        return {
          min_energy: 0.6,
          min_tempo: 120,
          target_valence: 0.8
        };
      case 'relax':
        return {
          max_energy: 0.4,
          max_tempo: 100,
          target_instrumentalness: 0.3
        };
      case 'party':
        return {
          min_danceability: 0.7,
          min_energy: 0.7,
          target_tempo: 120
        };
      case 'sleep':
        return {
          max_energy: 0.3,
          max_tempo: 90,
          min_instrumentalness: 0.4
        };
      case 'drive':
        return {
          min_energy: 0.5,
          target_tempo: 110,
          min_valence: 0.4
        };
      case 'vibe':
        return {
          target_energy: 0.5,
          target_valence: 0.6,
          min_danceability: 0.5
        };
      case 'celebrate':
        return {
          min_energy: 0.7,
          min_valence: 0.7,
          min_danceability: 0.7
        };
      default:
        return {};
    }
  };

  const testToken = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Token expired or invalid");
      console.log("Token is valid");
    } catch (error) {
      console.error(error);
      alert("Your session has expired. Please log in again.");
      navigate('/');
    }
  };

  const fetchTopArtists = async () => {
    try {
      const timeRanges = ['short_term', 'medium_term', 'long_term'];
      const artists = await Promise.all(
        timeRanges.map(range =>
          fetch(
            `https://api.spotify.com/v1/me/top/artists?limit=5&time_range=${range}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          ).then(res => res.json())
        )
      );

      const uniqueArtists = new Set();
      artists.forEach(response => {
        response.items?.forEach(artist => uniqueArtists.add(artist.id));
      });
      
      const artistArray = Array.from(uniqueArtists);
      setTopArtists(artistArray);
      console.log("Top artists fetched:", artistArray);
      return artistArray;
    } catch (error) {
      console.error("Error fetching top artists:", error);
      return [];
    }
  };

  const fetchTopTracks = async () => {
    try {
      const timeRanges = ['short_term', 'medium_term', 'long_term'];
      const tracks = await Promise.all(
        timeRanges.map(range =>
          fetch(
            `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${range}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          ).then(res => res.json())
        )
      );

      const uniqueTracks = new Set();
      tracks.forEach(response => {
        response.items?.forEach(track => uniqueTracks.add(track.id));
      });
      
      const trackArray = Array.from(uniqueTracks);
      setTopTracks(trackArray);
      console.log("Top tracks fetched:", trackArray);
      return trackArray;
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      return [];
    }
  };

  const fetchSavedTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.spotify.com/v1/me/tracks?limit=20",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch saved tracks: ${response.status}`);
      }

      const data = await response.json();
      const trackIds = data.items.map(item => item.track.id);
      setLikedTracks(trackIds);
      console.log("Liked tracks fetched:", trackIds);
      return trackIds;
    } catch (error) {
      console.error("Error fetching saved tracks:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      const [topArtistIds, topTrackIds, likedTrackIds] = await Promise.all([
        fetchTopArtists(),
        fetchTopTracks(),
        fetchSavedTracks()
      ]);

      const audioFeatures = getAudioFeatures(activity);
      
      const seedCombinations = [
        {
          seed_genres: genres.slice(0, 5).join(','),
          limit: 10
        },
        {
          seed_artists: topArtistIds.slice(0, 3).join(','),
          seed_genres: genres.slice(0, 2).join(','),
          limit: 10
        },
        {
          seed_tracks: topTrackIds.slice(0, 2).join(','),
          seed_genres: genres.slice(0, 2).join(','),
          seed_artists: topArtistIds.slice(0, 1).join(','),
          limit: 10
        }
      ];

      const recommendationSets = await Promise.all(
        seedCombinations.map(async (seeds) => {
          const params = new URLSearchParams({
            ...seeds,
            ...audioFeatures,
            min_popularity: '20',
            market: 'US'
          });

          const response = await fetch(
            `https://api.spotify.com/v1/recommendations?${params.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (!response.ok) return [];
          const data = await response.json();
          return data.tracks;
        })
      );

      const seenIds = new Set();
      const uniqueTracks = recommendationSets.flat().filter(track => {
        if (seenIds.has(track.id)) {
          return false;
        }
        seenIds.add(track.id);
        return true;
      });

      const finalTracks = uniqueTracks.filter(track => 
        !usedRecommendations.has(track.id)
      );

      setUsedRecommendations(new Set([
        ...Array.from(usedRecommendations),
        ...finalTracks.map(track => track.id)
      ]));

      const shuffledTracks = finalTracks
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);

      setSongs(shuffledTracks);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      fetchGenreOnlyRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const fetchGenreOnlyRecommendations = async () => {
    try {
      const audioFeatures = getAudioFeatures(activity);
      const params = new URLSearchParams({
        limit: '20',
        seed_genres: genres.slice(0, 5).join(","),
        ...audioFeatures,
        min_popularity: '20',
        market: 'US'
      });

      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch recommendations: ${response.status}`);

      const data = await response.json();
      setSongs(data.tracks);
    } catch (error) {
      console.error("Error in fallback recommendations:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const savePlaylistToSpotify = async () => {
    try {
      setLoading(true);
      
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userResponse.json();
      const userId = userData.id;

      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `Sonderfy ${activity} Playlist`,
            description: `A personalized ${activity} playlist created by Sonderfy`,
            public: false
          })
        }
      );
      const newPlaylist = await createPlaylistResponse.json();
      setPlaylistId(newPlaylist.id);

      const trackUris = songs.map(song => song.uri);
      await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });

      setShareLink(newPlaylist.external_urls.spotify);
      
      alert('Playlist saved successfully!');
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Failed to save playlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing playlist...");
    if (activity === "savedTracks") {
      fetchSavedTracks();
    } else {
      fetchRecommendations();
    }
  };

  const handleRemoveSong = (songId) => {
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
  };

  const handleHomeNavigation = () => {
    navigate('/', { 
      state: { 
        username: username 
      } 
    });
  };

  useEffect(() => {
    if (!token) {
      console.error("Token is missing");
      alert("No access token found. Please log in.");
      navigate('/');
      return;
    }

    testToken().then(() => {
      if (!activity) {
        console.error("Activity is missing");
        alert("Please select an activity first.");
        navigate('/');
        return;
      }

      if (activity === "savedTracks") {
        fetchSavedTracks();
      } else {
        fetchRecommendations();
      }
    });
  }, [activity, genres, token]);

  return (
    <div className="playlist-container">
      <div className="header">
        <h1 
          className="title" 
          onClick={handleHomeNavigation} 
          style={{ cursor: 'pointer' }}
        >
          sonderfy
        </h1>
        <button 
          className="share-button" 
          onClick={savePlaylistToSpotify}
          disabled={songs.length === 0}
        >
          Save Playlist
        </button>
      </div>

      {shareLink && (
        <div className="share-link-container">
          <input 
            type="text" 
            value={shareLink} 
            readOnly 
            className="share-link-input"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              alert('Playlist link copied to clipboard!');
            }}
            className="copy-link-button"
          >
            Copy Link
          </button>
        </div>
      )}

      <h2 className="playlist-title">
        {username}'s {activity} Playlist
      </h2>
      <p className="subtitle">
        Based on your Spotify playlists and chosen activity.
      </p>

      {loading && <p className="loading">Loading playlist...</p>}

      {!loading && songs.length === 0 && (
        <p>No songs found for the selected activity. Try another activity!</p>
      )}

      {!loading && songs.length > 0 && (
        <div className="song-list">
          {songs.map((song) => (
            <div key={song.id} className="song-row">
              <img
                src={song.album.images[0]?.url}
                alt={song.name}
                className="song-album"
              />
              <p className="song-name">{song.name}</p>
              <p className="song-artist">{song.artists[0].name}</p>
              <button
                className="remove-button"
                onClick={() => handleRemoveSong(song.id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Playlist
      </button>
    </div>
  );
};

export default Playlist;