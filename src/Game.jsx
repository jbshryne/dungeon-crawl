import { INVALID_MOVE } from "boardgame.io/core";
// import { isAdjacentTile } from "./Board";

export const DungeonHopper = {
  setup: () => ({
    tiles: Array(36).fill(null).fill("Hero", 22, 23).fill("Gobbo", 20, 21),
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
        position: 20,
        id: 1,
        moveTiles: 3,
        attack: 1,
        hitPoints: 3,
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
      // currentPlayer.moveTiles -= 1;
    },
    attack: ({ G, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerTeam = currentPlayer.team;
      const attackedPlayer = G.players.find(
        (player) => player.position === tileIdx
      );
      const attackedPlayerName = attackedPlayer.name;
      const attackedPlayerTeam = attackedPlayer.team;

      if (currentPlayerTeam !== attackedPlayerTeam) {
        attackedPlayer.hitPoints -= currentPlayer.attack;
        console.log(
          `${currentPlayer.name} attacks! ${attackedPlayerName} has ${attackedPlayer.hitPoints} hit points left`
        );
        if (attackedPlayer.hitPoints <= 0) {
          G.tiles[tileIdx] = null;
          attackedPlayer.position = null;
          console.log(`${attackedPlayerName} is dead!`);
        }
      } else {
        console.log("You can't attack your own team!");
        return INVALID_MOVE;
      }
    },
  },
};
