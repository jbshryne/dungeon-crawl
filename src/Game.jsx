// import { INVALID_MOVE } from "boardgame.io/core";
// import { isAdjacentTile } from "./Board";

export const DungeonHopper = {
  setup: () => ({
    tiles: Array(36).fill(null).fill("Hero", 22, 23).fill("Gobbo", 2, 3),
    players: [
      {
        name: "Hero",
        position: 22,
        id: 0,
        moveTiles: 3,
        attack: 1,
        hitPoints: 3,
        team: 0,
      },
      {
        name: "Gobbo",
        position: 2,
        id: 1,
        moveTiles: 3,
        attack: 1,
        hitPoints: 1,
        team: 1,
      },
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
    },
  },
};
