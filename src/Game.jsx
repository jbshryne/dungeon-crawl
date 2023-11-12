// import { INVALID_MOVE } from "boardgame.io/core";
// import { isAdjacentTile } from "./Board";

const hero = {
  name: "Hero",
  position: 22,
  id: 0,
  attackDice: 3,
  defenseDice: 2,
  hitPoints: 4,
  team: "HERO",
  moveTiles: 3,
  isMoving: false,
  hasMoved: false,
  hasDoneAction: false,
};

const enemy = {
  name: "Gobbo",
  position: 8,
  id: 1,
  attackDice: 2,
  defenseDice: 2,
  hitPoints: 3,
  team: "ENEMY",
  moveTiles: 3,
  isMoving: false,
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
    rollMovementDice: ({ G, ctx, random, events, playerID }) => {
      const currentPlayer = G.players[playerID];
      if (currentPlayer.isMoving) {
        console.log("You are already moving!");
      } else if (currentPlayer.hasMoved) {
        console.log("You have already moved this turn!");
      } else {
        currentPlayer.isMoving = true;
        const movementRoll = random.D6(2);
        const movementTotal = movementRoll[0] + movementRoll[1];
        currentPlayer.moveTiles = movementTotal;
        console.log(
          `${currentPlayer.name} rolled ${movementRoll[0]} and ${movementRoll[1]} for a total of ${movementTotal} movement tiles`
        );
      }
    },

    moveOneSquare: ({ G, events, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

      if (currentPlayer.isMoving) {
        G.tiles[currentPlayerPosition] = null;
        G.tiles[tileIdx] = currentPlayerName;
        G.players[playerID].position = tileIdx;
        currentPlayer.moveTiles -= 1;
        currentPlayer.hasMoved = true;
        if (currentPlayer.moveTiles === 0) {
          currentPlayer.isMoving = false;
          currentPlayer.hasMoved = true;
        }
      }
    },

    attack: ({ G, playerID, random, events }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerName = currentPlayer.name;
      const currentPlayerTeam = currentPlayer.team;
      const attackedPlayer = G.players.find(
        (player) => player.position === tileIdx
      );
      const attackedPlayerName = attackedPlayer.name;
      const attackedPlayerTeam = attackedPlayer.team;

      if (
        attackedPlayerTeam &&
        currentPlayerTeam !== attackedPlayerTeam &&
        !currentPlayer.hasDoneAction
      ) {
        // events.endStage();
        console.log(
          currentPlayerName + " attacks " + attackedPlayerName + "..."
        );
        currentPlayer.hasDoneAction = true;
        if (currentPlayer.isMoving) {
          currentPlayer.isMoving = false;
          currentPlayer.hasMoved = true;
        }
        const attackRoll = getBattleDice(random.D6(currentPlayer.attackDice));
        const defenseRoll = getBattleDice(
          random.D6(attackedPlayer.defenseDice)
        );
        let attackTotal = attackRoll.filter((die) => die === "atk").length;
        let defenseTotal;
        if (attackedPlayerTeam === "HERO") {
          defenseTotal = defenseRoll.filter((die) => die === "hDef").length;
        } else {
          defenseTotal = defenseRoll.filter((die) => die === "eDef").length;
        }
        // attackedPlayer.hitPoints -= attackTotal - defenseTotal;
        console.log("Attack roll:", attackRoll, "successes:", attackTotal);
        console.log("Defense roll:", defenseRoll, "successes:", defenseTotal);

        if (attackTotal - defenseTotal > 0) {
          attackedPlayer.hitPoints -= attackTotal - defenseTotal;
          console.log(
            `SUCCESS! ${attackedPlayerName} has ${attackedPlayer.hitPoints} now hit point(s)`
          );
        } else {
          console.log("Attack misses!");
        }

        if (attackedPlayer.hitPoints <= 0) {
          G.tiles[tileIdx] = null;
          attackedPlayer.position = null;
          console.log(`${attackedPlayerName} is dead!`);
        }
      } else if (currentPlayerTeam === attackedPlayerTeam) {
        console.log("You can't attack your own team!");
        // return INVALID_MOVE;
      } else if (currentPlayer.hasDoneAction) {
        console.log("You have already performed an action this turn!");
        // return INVALID_MOVE;
      }
    },
  },

  turn: {
    onBegin: ({ G }) => {
      G.players.forEach((player) => {
        player.hasMoved = false;
        player.hasDoneAction = false;
      });

      // console.log(`It is ${currentPlayer.name}'s turn`);
      // currentPlayer.hasMoved = false;
      // currentPlayer.hasDoneAction = false;
    },

    // stages: {
    //   movement: {
    //     moves: {
    //       moveOneSquare: ({ G, events, playerID }, tileIdx) => {
    //         const currentPlayer = G.players[playerID];
    //         const currentPlayerPosition = currentPlayer.position;
    //         const currentPlayerName = currentPlayer.name;

    //         G.tiles[currentPlayerPosition] = null;
    //         G.tiles[tileIdx] = currentPlayerName;
    //         G.players[playerID].position = tileIdx;
    //         currentPlayer.moveTiles -= 1;
    //         currentPlayer.hasMoved = true;
    //         if (currentPlayer.moveTiles === 0) {
    //           events.endStage();
    //         }
    //       },
    //     },
    //   },
    // },
  },
};

function getBattleDice(diceArray) {
  const dice = diceArray.map((die) => {
    if (die === 1) {
      return "eDef";
    } else if (die === 2 || die === 3) {
      return "hDef";
    } else {
      return "atk";
    }
  });
  return dice;
}
