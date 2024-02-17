import React from "react";
import { Link } from "react-router-dom";
import { GiFishMonster, GiSwordwoman } from "react-icons/gi";

const SelectAvatar = () => {
  return (
    <div className="select-page">
      <h1>Choose your avatar</h1>
      <br />
      <div>
        <Link to="/game/0">
          <button>
            <GiSwordwoman style={{ fontSize: "40" }} /> <big>Quester</big>
          </button>
        </Link>
        <Link to="/game/1">
          <button>
            <GiFishMonster style={{ fontSize: "40" }} /> <big>Monster</big>
          </button>
        </Link>
      </div>
      <br />
      <br />
      <br />
      <div className="controls">
        <p>
          <b>NOTE: Multiplayer mode is currently under development</b>
        </p>
        <Link to="game">
          <button>PLAY LOCAL GAME</button>
        </Link>
      </div>
    </div>
  );
};

export default SelectAvatar;
