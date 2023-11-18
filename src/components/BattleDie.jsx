import React from "react";
import { GiSwordWound } from "react-icons/gi";
import { GiArrowsShield } from "react-icons/gi";

const BattleDie = ({ result, type }) => {
  // console.log(result);

  const isSuccess = result === type;

  return (
    <div className={`battle-die ${isSuccess ? "success" : "failure"} `}>
      {result === "atk" && <GiSwordWound />}
      {result === "def" && <GiArrowsShield />}
      {result === "blank" && ""}
    </div>
  );
};

export default BattleDie;
