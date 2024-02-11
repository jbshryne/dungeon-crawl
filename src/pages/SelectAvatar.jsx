import React from "react";
import { Link } from "react-router-dom";

const SelectAvatar = () => {
  return (
    <div>
      <h1>Choose your avatar</h1>
      <Link to="/game/quester">
        <button>Quester</button>
      </Link>
      <Link to="/game/monster">
        <button>Monster</button>
      </Link>
    </div>
  );
};

export default SelectAvatar;
