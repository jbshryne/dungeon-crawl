import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div id="landing-page">
      {/* <NavBar /> */}
      <h1 className="hero-title">Dungeon Throwdown</h1>
      <img
        // style={{ width: 700 }}
        id="hero-image"
        src="/assets/dungeon-throwdown 02.png"
        alt="female warrior battling reptile"
      />
      <Link to="/game">
        <h2>PROCEED TO GAME</h2>
      </Link>
    </div>
  );
};

export default Home;
