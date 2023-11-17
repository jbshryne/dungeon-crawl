import React from "react";
import { GiSwordWound } from "react-icons/gi";
import { GiArrowsShield } from "react-icons/gi";

const BattleDie = ({ result }) => {
  console.log(result);
  return (
    <div className="battle-die">
      {result === "atk" && <GiSwordWound />}
      {result === "def" && <GiArrowsShield />}
    </div>
  );
};

export default BattleDie;
