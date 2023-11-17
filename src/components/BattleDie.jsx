import React from "react";
import { GiSwordWound } from "react-icons/gi";
import { GiArrowsShield } from "react-icons/gi";

const BattleDie = ({ result, isAttacking }) => {
  console.log(result);

  const isSuccess =
    (result === "atk" && isAttacking) || (result === "def" && !isAttacking);

  return (
    <div
      className={`battle-die ${!isSuccess ? "" : "failure"} ${
        result === "blank" ? "failure" : ""
      }`}
    >
      {result === "atk" && <GiSwordWound />}
      {result === "def" && <GiArrowsShield />}
      {result === "blank" && ""}
    </div>
  );
};

export default BattleDie;
