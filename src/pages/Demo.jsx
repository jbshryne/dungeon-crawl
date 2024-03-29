import React, { useState, useEffect } from "react";
import { Client } from "boardgame.io/react";
// import { SocketIO } from "boardgame.io/multiplayer";
import { DungeonThrowdown } from "../components/Game";
import { Board } from "../components/Board";

const Multiplayer = Client({
  game: DungeonThrowdown,
  board: BoardDisplay,
  debug: false,
  //   numPlayers: 2,
  //   multiplayer: SocketIO({ server: "localhost:8000" }),
});

function BoardDisplay({ G, ctx, moves, events, playerID, reset }) {
  const [gameMessage, setGameMessage] = useState(G.messages.game);

  useEffect(() => {
    // Update gameMessage whenever G or ctx changes
    setGameMessage(G.messages.game);
  }, [G.messages.game]);

  // console.log("playerID", playerID);

  return (
    <div id="board-display">
      <p className="game-message">{gameMessage}</p>
      <Board G={G} ctx={ctx} moves={moves} events={events} />
    </div>
  );
}

export default Multiplayer;
