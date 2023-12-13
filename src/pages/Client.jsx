import React, { useState, useEffect } from "react";
import { Client } from "boardgame.io/react";
import { DungeonThrowdown } from "../components/Game";
import { Board } from "../components/Board";

const BoardGame = Client({
  game: DungeonThrowdown,
  board: BoardDisplay,
  // debug: false,
});

function BoardDisplay({ G, ctx, moves, events }) {
  const [gameMessage, setGameMessage] = useState(G.messages.game);

  useEffect(() => {
    // Update gameMessage whenever G or ctx changes
    setGameMessage(G.messages.game);
  }, [G.messages.game]);

  return (
    <div id="board-display">
      <p className="game-message">{gameMessage}</p>
      <Board G={G} ctx={ctx} moves={moves} events={events} />
    </div>
  );
}

export default BoardGame;
