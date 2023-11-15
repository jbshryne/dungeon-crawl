// import { INVALID_MOVE } from "boardgame.io/core";
import { calculateMoveTiles, getAdjacentTiles } from "./Board";

const hero = {
  id: 0,
  name: "Hero",
  type: "PLAYER",
  team: "HERO",
  position: 27,
  attackDice: 3,
  attackBoost: 0,
  defenseDice: 2,
  defenseBoost: 0,
  hitPoints: 5,
  moveTiles: 0,
  powerup: null,
  isMoving: false,
  hasMoved: false,
  hasDoneAction: false,
};

const monster = {
  id: 1,
  name: "Gobbo",
  type: "PLAYER",
  team: "MONSTER",
  position: 28,
  attackDice: 3,
  attackBoost: 0,
  defenseDice: 2,
  defenseBoost: 0,
  hitPoints: 5,
  moveTiles: 0,
  powerup: null,
  isMoving: false,
  hasMoved: false,
  hasDoneAction: false,
};

const players = [hero, monster];

const startingBoxes = [
  { position: boxStartPosition(players), type: "BOX" },
  { position: boxStartPosition(players), type: "BOX" },
  { position: boxStartPosition(players), type: "BOX" },
];

export const DungeonHopper = {
  setup: () => ({
    tiles: Array(64)
      .fill(null)
      .fill("box", startingBoxes[0].position, startingBoxes[0].position + 1)
      .fill("box", startingBoxes[1].position, startingBoxes[1].position + 1)
      .fill("box", startingBoxes[2].position, startingBoxes[2].position + 1)
      .fill(hero.name, hero.position, hero.position + 1)
      .fill(monster.name, monster.position, monster.position + 1),
    players,
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
      console.log(attackedPlayer);
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
        const attackRoll = getBattleRoll(
          random.D6(currentPlayer.attackDice + currentPlayer.attackBoost)
        );
        const defenseRoll = getBattleRoll(
          random.D6(attackedPlayer.defenseDice + attackedPlayer.defenseBoost)
        );
        const attackTotal = attackRoll.filter((die) => die === "atk").length;
        const defenseTotal = defenseRoll.filter((die) => die === "def").length;

        // attackedPlayer.hitPoints -= attackTotal - defenseTotal;
        console.log("Attack roll:", attackRoll, "successes:", attackTotal);
        console.log("Defense roll:", defenseRoll, "successes:", defenseTotal);

        if (attackTotal - defenseTotal > 0) {
          attackedPlayer.hitPoints -= attackTotal - defenseTotal;

          console.log(
            `SUCCESS! ${attackedPlayerName} has ${attackedPlayer.hitPoints} now hit point(s)`
          );

          if (attackedPlayer.powerup) {
            console.log(
              `${attackedPlayerName} lost the ${attackedPlayer.powerup.name}!`
            );
            attackedPlayer.powerup = null;
            attackedPlayer.attackBoost = 0;
            attackedPlayer.defenseBoost = 0;
          }
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
    openBox: ({ G, playerID, random }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerName = currentPlayer.name;
      // const currentPlayerTeam = currentPlayer.team;
      const box = G.tiles[tileIdx];

      if (box === "box") {
        console.log(currentPlayerName + " opens the box...");
        currentPlayer.hasDoneAction = true;
        G.tiles[tileIdx] = null;
        const boxRoll = random.D10(1);
        const boxRollResult = getBoxRoll(boxRoll[0]);

        if (boxRollResult) {
          if (boxRollResult.type === "HP") {
            currentPlayer.hitPoints += boxRollResult.boost;
            console.log(
              `${currentPlayerName} found a ${boxRollResult.name} and gained ${boxRollResult.boost} hit point(s)!`
            );
          } else if (boxRollResult.type === "ATK") {
            currentPlayer.powerup = boxRollResult;
            // reset any boosts from previous powerup
            currentPlayer.attackBoost = 0;
            currentPlayer.defenseBoost = 0;

            currentPlayer.attackBoost += boxRollResult.boost;
            console.log(
              `${currentPlayerName} found ${boxRollResult.name} and gained ${boxRollResult.boost} attack dice!`
            );
          } else if (boxRollResult.type === "DEF") {
            currentPlayer.powerup = boxRollResult;
            // reset any boosts from previous powerup
            currentPlayer.attackBoost = 0;
            currentPlayer.defenseBoost = 0;

            currentPlayer.defenseBoost += boxRollResult.boost;
            console.log(
              `${currentPlayerName} found ${boxRollResult.name} and gained ${boxRollResult.boost} defense dice!`
            );
          }
        } else {
          console.log("The box was empty!");
        }
      } else {
        console.log("There is no box here!");
      }
    },
  },

  turn: {
    onBegin: ({ G, ctx }) => {
      G.players.forEach((player) => {
        player.hasMoved = false;
        player.isMoving = false;
        player.hasDoneAction = false;
      });

      const currentPlayer = G.players[ctx.currentPlayer];
      console.log("Active Team:", currentPlayer.team);
    },
  },

  endIf: ({ G, ctx }) => {
    const currentPlayer = G.players[ctx.currentPlayer];
    const currentTeam = currentPlayer.team;
    const otherTeam = currentTeam === "HERO" ? "MONSTER" : "HERO";
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

  // ai: {
  //   enumerate: (G, ctx) => {
  //     const moves = [];
  //     const currentPlayer = G.players[ctx.currentPlayer];
  //     const currentPosition = currentPlayer.position;
  //     const currentPlayerTeam = currentPlayer.team;

  //     const otherTeam = currentPlayerTeam === "HERO" ? "MONSTER" : "HERO";
  //     const otherTeamPlayers = G.players.filter(
  //       (player) => player.team === otherTeam
  //     );

  //     // If there are no enemies left, AI can only move
  //     if (otherTeamPlayers.length === 0) {
  //       moves.push({ move: "rollMovementDice" });
  //       return moves;
  //     }

  //     let minDistance = Infinity;
  //     let closestEnemy = null;

  //     // Find the closest monster
  //     otherTeamPlayers.forEach((monster) => {
  //       const distance = calculateMoveTiles(
  //         currentPosition,
  //         monster.position,
  //         G.tiles.length
  //       );
  //       if (distance < minDistance) {
  //         minDistance = distance;
  //         closestEnemy = monster;
  //       }
  //     });

  //     const adjacentTiles = getAdjacentTiles(currentPosition, G.tiles.length);

  //     // Calculate the distance from each adjacent tile to the close monster
  //     adjacentTiles.forEach((adjacentTile) => {
  //       const distance = calculateMoveTiles(
  //         adjacentTile,
  //         closestEnemy.position,
  //         G.tiles.length
  //       );

  //       // If the distance is less than the current distance, move to that tile
  //       if (
  //         distance < minDistance &&
  //         G.tiles[adjacentTile] === null &&
  //         currentPlayer.isMoving
  //       ) {
  //         moves.push({ move: "moveOneSquare", args: [adjacentTile] });
  //       }
  //     });

  //     // If AI is next to the monster, it should attack
  //     if (minDistance === 1) {
  //       moves.push({ move: "attack", args: [closestEnemy.position] });
  //     }

  //     // If the AI can't do any of the above, then it should roll the movement dice
  //     if (moves.length === 0) {
  //       moves.push({ move: "rollMovementDice" });
  //     }

  //     return moves;
  //   },
  // },
};

function getBattleRoll(diceArray) {
  const dice = diceArray.map((die) => {
    if (die === 1) {
      return "blank";
    } else if (die === 2 || die === 3) {
      return "def";
    } else {
      return "atk";
    }
  });
  return dice;
}

function boxStartPosition(players) {
  // const playerPositions = players.map((player) => player.position);
  const boxStart = Math.floor(Math.random() * 100);
  // if (playerPositions.includes(boxStart)) {
  //   return boxStartPosition(players);
  // }
  return boxStart;
}

function getBoxRoll(result) {
  if (result === 10) {
    return { name: "Fiery Sword", type: "ATK", boost: 2 };
  } else if (result === 9 || result === 8) {
    return { name: "Sword", type: "ATK", boost: 1 };
  } else if (result === 7 || result === 6) {
    return { name: "Shield", type: "DEF", boost: 1 };
  } else if (result === 5 || result === 4) {
    return { name: "Healing Potion", type: "HP", boost: 1 };
  } else {
    return null;
  }
}
