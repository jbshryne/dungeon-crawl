import { INVALID_MOVE } from "boardgame.io/core";
// import { isAdjacentTile } from "./Board";

const hero = {
  name: "Hero",
  position: 22,
  id: 0,
  attack: 1,
  hitPoints: 3,
  team: 0,
  moveTiles: 3,
  hasMoved: false,
  hasDoneAction: false,
};

const enemy = {
  name: "Gobbo",
  position: 8,
  id: 1,
  attack: 1,
  hitPoints: 3,
  team: 1,
  moveTiles: 3,
  hasMoved: false,
  hasDoneAction: false,
};

//
export const DungeonHopper = {
  setup: () => ({
    tiles: Array(36)
      .fill(null)
      .fill(hero.name, hero.position, hero.position + 1)
      .fill(enemy.name, enemy.position, enemy.position + 1),
    players: [hero, enemy],
  }),

  moves: {
    moveOneSquare: ({ G, ctx, events, playerID }, tileIdx) => {
      // const currentPlayer = G.players[playerID];
      // const currentPlayerPosition = currentPlayer.position;
      // const currentPlayerName = currentPlayer.name;
      // G.tiles[currentPlayerPosition] = null;
      // G.tiles[tileIdx] = currentPlayerName;
      // G.players[playerID].position = tileIdx;
      // currentPlayer.moveTiles -= 1;
      // currentPlayer.hasMoved = true;
      // if (currentPlayer.moveTiles === 0) {
      //   events.endStage();
      // }
      console.log("You moved to tile " + tileIdx);
      console.log(G);
    },
    attack: ({ G, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerTeam = currentPlayer.team;
      const attackedPlayer = G.players.find(
        (player) => player.position === tileIdx
      );
      // console.log(tileIdx, attackedPlayer);
      const attackedPlayerName = attackedPlayer.name;
      const attackedPlayerTeam = attackedPlayer.team;

      if (attackedPlayerTeam && currentPlayerTeam !== attackedPlayerTeam) {
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
    // rollToAttack: ({ G, playerID }, tileIdx) => {
    //   const currentPlayer = G.players[playerID];
    //   const currentPlayerTeam = currentPlayer.team;
    //   const attackedPlayer = G.players.find(
    //     (player) => player.position === tileIdx
    //   );
    //   const attackedPlayerName = attackedPlayer.name;
    //   const attackedPlayerTeam = attackedPlayer.team;

    //   if (currentPlayerTeam !== attackedPlayerTeam) {
    //     attackedPlayer.hitPoints -= currentPlayer.attack;
    //     console.log(
    //       `${currentPlayer.name} attacks! ${attackedPlayerName} has ${attackedPlayer.hitPoints} hit points left`
    //     );
    //     if (attackedPlayer.hitPoints <= 0) {
    //       G.tiles[tileIdx] = null;
    //       attackedPlayer.position = null;
    //       console.log(`${attackedPlayerName} is dead!`);
    //     }
    //   } else {
    //     console.log("You can't attack your own team!");
    //     return INVALID_MOVE;
    //   }
    // }
    rollMovementDice: ({ G, ctx, random, events, playerID }) => {
      const currentPlayer = G.players[playerID];
      if (currentPlayer.hasMoved) {
        console.log("You have already moved this turn!");
        // return INVALID_MOVE;
      } else {
        const movementRoll = random.D6(2);
        const movementTotal = movementRoll[0] + movementRoll[1];
        currentPlayer.moveTiles = movementTotal;
        console.log(
          `${currentPlayer.name} rolled ${movementRoll[0]} and ${movementRoll[1]} for a total of ${movementTotal} movement tiles`
        );
        console.log(events);
        events.setStage("movement");
      }
    },
  },

  turn: {
    stages: {
      movement: {
        moves: {
          moveOneSquare: ({ G, ctx, events, playerID }, tileIdx) => {
            const currentPlayer = G.players[playerID];
            const currentPlayerPosition = currentPlayer.position;
            const currentPlayerName = currentPlayer.name;

            G.tiles[currentPlayerPosition] = null;
            G.tiles[tileIdx] = currentPlayerName;
            G.players[playerID].position = tileIdx;
            currentPlayer.moveTiles -= 1;
            currentPlayer.hasMoved = true;
            if (currentPlayer.moveTiles === 0) {
              events.endStage();
            }
            // console.log("You moved to tile " + tileIdx);
          },
        },
      },
    },
  },
};
