import React from "react";

const GameInfo = ({ message }) => {
  console.log("message in GameInfo.js:", message);

  return <div>{message}</div>;
};

export default GameInfo;
