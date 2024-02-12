import React from "react";
import { Link } from "react-router-dom";
import { GiFishMonster, GiSwordwoman } from "react-icons/gi";

const SelectAvatar = () => {
  return (
    <div className="select-page">
      <h1>Choose your avatar</h1>
      <div className="controls">
        <Link to="/game/0">
          <button>
            <GiSwordwoman style={{ fontSize: "50" }} />
          </button>
        </Link>
        <Link to="/game/1">
          <button>
            <GiFishMonster style={{ fontSize: "50" }} />
          </button>
        </Link>
      </div>
      <p>
        <b>NOTE: Multiplayer mode is currently under development</b>
      </p>
      <Link to="game">
        <button>PLAY LOCAL GAME</button>
      </Link>
    </div>
  );
};

export default SelectAvatar;
