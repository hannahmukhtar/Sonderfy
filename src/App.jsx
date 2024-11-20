import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Callback from './pages/Callback.jsx';
import Activity from './pages/Activity.jsx';
import Playlist from "./pages/Playlist.jsx";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </Router>
  );
}
export default App;