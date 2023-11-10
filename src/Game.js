// import { INVALID_MOVE } from "boardgame.io/core";

export const MovementTest = {
  setup: () => ({
    tiles: Array(25).fill(null).fill("Mario", 22, 23),
    players: [
      { name: "Mario", position: 22, id: 0, moveTiles: 6 },
      { name: "Goomba", position: 2, id: 1, moveTiles: 6 },
    ],
  }),

  moves: {
    moveOneSquare: ({ G, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

      G.tiles[currentPlayerPosition] = null;
      G.tiles[tileIdx] = currentPlayerName;
      G.players[playerID].position = tileIdx;
      currentPlayer.moveTiles -= 1;
      console.log("moves left:", G.players[playerID].moveTiles);
    },
  },
};
