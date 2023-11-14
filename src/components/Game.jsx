// import { INVALID_MOVE } from "boardgame.io/core";
import { calculateMoveTiles, getAdjacentTiles } from "./Board";

const hero = {
  name: "Hero",
  position: 9,
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
    getDistance: ({ G, ctx }, tileIdx) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      const currentPosition = currentPlayer.position;
      const distance = calculateMoveTiles(
        currentPosition,
        tileIdx,
        G.tiles.length
      );
      console.log(distance);
      console.log(G.ai.play);
      // return distance;
    },

    rollMovementDice: ({ G, ctx, random, events, playerID }) => {
      const currentPlayer = G.players[playerID];
      if (currentPlayer.isMoving) {
        console.log("You are already moving!");
      } else if (currentPlayer.hasMoved) {
        console.log("You have already moved this turn!");
      } else {
        console.log(getAdjacentTiles(currentPlayer.position, G.tiles.length));
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
      const currentPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

      if (currentPlayer.isMoving) {
        // console.log(getAdjacentTiles(currentPosition, G.tiles.length));
        G.tiles[currentPosition] = null;
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
    onBegin: ({ G, ctx }) => {
      G.players.forEach((player) => {
        player.hasMoved = false;
        player.hasDoneAction = false;
      });

      const currentPlayer = G.players[ctx.currentPlayer];
      console.log("Active Team:", currentPlayer.team);
    },
  },

  endIf: ({ G, ctx }) => {
    const currentPlayer = G.players[ctx.currentPlayer];
    const currentTeam = currentPlayer.team;
    const otherTeam = currentTeam === "HERO" ? "ENEMY" : "HERO";
    const otherTeamPlayers = G.players.filter(
      (player) => player.team === otherTeam
    );
    const otherTeamHitPoints = otherTeamPlayers.reduce(
      (total, player) => total + player.hitPoints,
      0
    );
    if (otherTeamHitPoints === 0 && currentPlayer.hasDoneAction) {
      console.log(`Team ${currentTeam} wins!`);
      return { winner: currentTeam };
    }
  },

  // ai: {
  //   enumerate: (G, ctx) => {
  //     const moves = [];

  //     const currentPlayer = G.players[ctx.currentPlayer];
  //     const currentPosition = currentPlayer.position;
  //     const currentPlayerTeam = currentPlayer.team;

  //     const otherTeam = "HERO"
  //     const otherTeamPlayers = G.players.filter(
  //       (player) => player.team === otherTeam
  //     );
  //     const otherTeamPositions = otherTeamPlayers.map(
  //       (player) => player.position
  //     );
  //     const isAdjacentToOtherTeam = (position) => {
  //       const adjacentPositions = getAdjacentTiles(position, G.tiles.length);
  //       return adjacentPositions.some((position) => {
  //         return otherTeamPositions.includes(position);
  //       });
  //     };

  //     if (isAdjacentToOtherTeam(currentPosition)) {
  //       otherTeamPositions.forEach((position) => {
  //         if (isAdjacentTile(position, currentPosition, G.tiles.length)) {
  //           moves.push({ move: "attack", args: [position] });
  //         }
  //       });
  //     } else {
  //       if (!currentPlayer.isMoving && !currentPlayer.hasMoved) {
  //         moves.push({ move: "rollMovementDice" });
  //       } else if (currentPlayer.isMoving) {
  //         const possibleMoves = getAdjacentTiles(
  //           currentPosition,
  //           G.tiles.length
  //         );
  //         possibleMoves.forEach((tileIdx) => {
  //           if (G.tiles[tileIdx] === null) {
  //             moves.push({ move: "moveOneSquare", args: [tileIdx] });
  //           }
  //         });
  //       }
  //     }
  //     return moves;
  //   },
  // },

  ai: {
    enumerate: (G, ctx) => {
      const moves = [];
      const currentPlayer = G.players[ctx.currentPlayer];
      const currentPosition = currentPlayer.position;
      const currentPlayerTeam = currentPlayer.team;

      const otherTeam = currentPlayerTeam === "HERO" ? "ENEMY" : "HERO";
      const otherTeamPlayers = G.players.filter(
        (player) => player.team === otherTeam
      );

      // If there are no enemies left, AI can only move
      if (otherTeamPlayers.length === 0) {
        moves.push({ move: "rollMovementDice" });
        return moves;
      }

      let minDistance = Infinity;
      let closestEnemy = null;

      // Find the closest enemy
      otherTeamPlayers.forEach((enemy) => {
        const distance = calculateMoveTiles(
          currentPosition,
          enemy.position,
          G.tiles.length
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestEnemy = enemy;
        }
      });

      const adjacentTiles = getAdjacentTiles(currentPosition, G.tiles.length);

      // Calculate the distance from each adjacent tile to the close enemy
      adjacentTiles.forEach((adjacentTile) => {
        const distance = calculateMoveTiles(
          adjacentTile,
          closestEnemy.position,
          G.tiles.length
        );

        // If the distance is less than the current distance, move to that tile
        if (
          distance < minDistance &&
          G.tiles[adjacentTile] === null &&
          currentPlayer.isMoving
        ) {
          moves.push({ move: "moveOneSquare", args: [adjacentTile] });
        }
      });

      // If AI is next to the enemy, it should attack
      if (minDistance === 1) {
        moves.push({ move: "attack", args: [closestEnemy.position] });
      }

      // If the AI can't do any of the above, then it should roll the movement dice
      if (moves.length === 0) {
        moves.push({ move: "rollMovementDice" });
      }

      return moves;
    },
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
