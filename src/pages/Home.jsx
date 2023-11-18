import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div id="landing-page">
      <h1 className="hero-title">Dungeon Throwdown</h1>
      <img
        // style={{ width: 700 }}
        id="hero-image"
        src="/assets/dungeon-throwdown 02.png"
        alt="female warrior battling reptile"
      />
      <Link to="/game">
        <button>PROCEED TO GAME</button>
      </Link>
    </div>
  );
};

export default Home;
