// import { INVALID_MOVE } from "boardgame.io/core";
import { calculateMoveTiles, getAdjacentTiles } from "./Board";

const hero = {
  id: 0,
  name: "Quester",
  type: "PLAYER",
  team: "Quester",
  position: 56,
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
  name: "Monster",
  type: "PLAYER",
  team: "Monster",
  position: 24,
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

const occupiedTiles = players.map((player) => player.position);

const startingBoxes = [
  { position: boxPosition(occupiedTiles), type: "BOX" },
  { position: boxPosition(occupiedTiles), type: "BOX" },
  { position: boxPosition(occupiedTiles), type: "BOX" },
];

export const DungeonThrowdown = {
  setup: () => ({
    tiles: Array(81)
      .fill(null)
      .fill("BOX", startingBoxes[0].position, startingBoxes[0].position + 1)
      .fill("BOX", startingBoxes[1].position, startingBoxes[1].position + 1)
      .fill("BOX", startingBoxes[2].position, startingBoxes[2].position + 1)
      .fill(hero.team, hero.position, hero.position + 1)
      .fill(monster.team, monster.position, monster.position + 1),
    players,
    messages: {
      game: "Let the Dungeon Throwdown begin!",
      p1: "",
      p2: "",
    },
    movementDice: [],
    battleDice: {
      p1: [],
      p2: [],
    },
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

    moveOneSquare: ({ G, events, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

      // console.log(getAdjacentTiles(currentPosition, G.tiles.length));
      if (currentPlayer.moveTiles > 0) {
        G.tiles[currentPosition] = null;
        G.tiles[tileIdx] = currentPlayerName;
        G.players[playerID].position = tileIdx;
        currentPlayer.moveTiles -= 1;
        currentPlayer.isMoving = true;
      }
      if (currentPlayer.moveTiles === 0) {
        currentPlayer.isMoving = false;
        currentPlayer.hasMoved = true;
        if (
          getAdjacentTiles(currentPosition, G.tiles.length).forEach((tile) => {
            return tile === null;
          }) &&
          currentPlayer.hasDoneAction
        ) {
          events.endTurn();
        }
      }
    },

    attack: ({ G, playerID, random }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const isPlayer1 = playerID === "0";
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
        const attackRoll = getBattleRoll(
          random.D6(currentPlayer.attackDice + currentPlayer.attackBoost)
        );
        const defenseRoll = getBattleRoll(
          random.D6(attackedPlayer.defenseDice + attackedPlayer.defenseBoost)
        );

        const attackTotal = attackRoll.filter((die) => die === "atk").length;
        const defenseTotal = defenseRoll.filter((die) => die === "def").length;

        console.log("Attack roll:", attackRoll, "successes:", attackTotal);
        if (isPlayer1) {
          G.battleDice.p1 = attackRoll;
        } else {
          G.battleDice.p2 = attackRoll;
        }
        console.log("Defense roll:", defenseRoll, "successes:", defenseTotal);
        if (isPlayer1) {
          G.battleDice.p2 = defenseRoll;
        } else {
          G.battleDice.p1 = defenseRoll;
        }

        if (attackTotal - defenseTotal > 0) {
          attackedPlayer.hitPoints -= attackTotal - defenseTotal;

          G.messages.game = `SUCCESSFULL ATTACK! ${attackedPlayerName} has ${
            attackedPlayer.hitPoints
          } now hit point(s)${
            attackedPlayer.powerup
              ? `  and has the ${attackedPlayer.powerup.name}!`
              : ""
          }`;

          if (attackedPlayer.powerup) {
            console.log(
              `${attackedPlayerName} lost the ${attackedPlayer.powerup.name}!`
            );
            attackedPlayer.powerup = null;
            attackedPlayer.attackBoost = 0;
            attackedPlayer.defenseBoost = 0;
          }
        } else {
          G.messages.game = "The attack misses!";
        }

        if (attackedPlayer.hitPoints <= 0) {
          G.tiles[tileIdx] = null;
          attackedPlayer.position = null;
          G.messages.game = `${attackedPlayerName} is defeated! ${currentPlayerName} WINS!`;
        }
      } else if (currentPlayerTeam === attackedPlayerTeam) {
        console.log("You can't attack your own team!");
      } else if (currentPlayer.hasDoneAction) {
        G.messages.game = "You have already performed an action this turn!";
      }
      if (currentPlayer.isMoving) {
        currentPlayer.isMoving = false;
        currentPlayer.hasMoved = true;
      }
    },
    openBox: ({ G, playerID, random }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerName = currentPlayer.name;
      const currentPlayerTeam = currentPlayer.team;
      const opponent = G.players.find(
        (player) => player.team !== currentPlayerTeam
      );
      const box = G.tiles[tileIdx];

      if (box === "BOX" && !currentPlayer.hasDoneAction) {
        if (currentPlayer.isMoving) {
          currentPlayer.isMoving = false;
          currentPlayer.hasMoved = true;
        }
        console.log(currentPlayerName + " opens the box...");
        currentPlayer.hasDoneAction = true;
        G.tiles[tileIdx] = null;
        const boxRoll = random.D12(1);
        const boxRollResult = getBoxRoll(boxRoll[0]);

        if (boxRollResult) {
          if (boxRollResult.type === "HP") {
            currentPlayer.hitPoints += boxRollResult.amount;
            G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} and gains ${boxRollResult.amount} hit point!`;
          } else if (boxRollResult.type === "DMG") {
            opponent.hitPoints -= boxRollResult.amount;
            G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} -- ${opponent.name} is struck and loses ${boxRollResult.amount} hit point!`;
          } else if (boxRollResult.type === "ATK") {
            currentPlayer.powerup = boxRollResult;
            // reset any boosts from previous powerup
            currentPlayer.attackBoost = 0;
            currentPlayer.defenseBoost = 0;

            currentPlayer.attackBoost += boxRollResult.amount;
            G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} and adds ${boxRollResult.amount} to attack dice!`;
          } else if (boxRollResult.type === "DEF") {
            currentPlayer.powerup = boxRollResult;
            // reset any boosts from previous powerup
            currentPlayer.attackBoost = 0;
            currentPlayer.defenseBoost = 0;

            currentPlayer.defenseBoost += boxRollResult.amount;
            G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} and adds ${boxRollResult.amount} to defense dice!`;
          }
        } else {
          G.messages.game = "The box is empty!";
        }
      } else {
        G.messages.game = "Can't do that right now!";
      }
    },
  },

  turn: {
    onBegin: ({ G, ctx, random }) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      currentPlayer.isMoving = false;
      currentPlayer.hasMoved = false;
      currentPlayer.hasDoneAction = false;

      const movementRoll = random.D6(2);
      const movementTotal = movementRoll[0] + movementRoll[1];
      currentPlayer.moveTiles = movementTotal;
      console.log(
        `${currentPlayer.name} rolled ${movementRoll[0]} and ${movementRoll[1]} for a total of ${movementTotal} movement tiles`
      );
      G.movementDice = movementRoll;

      const occupiedTiles = G.tiles.map((tile, idx) => {
        if (tile !== null) {
          return idx;
        }
      });

      const rollForNewBox = random.D8(1);
      if (
        rollForNewBox[0] === 1 ||
        rollForNewBox[0] === 2 ||
        rollForNewBox[0] === 3
      ) {
        const newBox = { position: boxPosition(occupiedTiles), type: "BOX" };
        G.tiles[newBox.position] = newBox.type;
      }
    },

    onEnd: ({ G, ctx }) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      if (currentPlayer.isMoving) {
        currentPlayer.isMoving = false;
        currentPlayer.hasMoved = true;
      }
    },

    endIf: ({ G, ctx }) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      return (
        !currentPlayer.isMoving &&
        currentPlayer.hasMoved &&
        currentPlayer.hasDoneAction
        // || (
        //   !currentPlayer.isMoving &&
        //   currentPlayer.hasMoved &&
        //   getAdjacentTiles(currentPlayer.position, G.tiles.length).length === 0
        // )
      );
    },
  },

  endIf: ({ G, ctx }) => {
    const currentPlayer = G.players[ctx.currentPlayer];
    const currentTeam = currentPlayer.team;
    const otherTeam = currentTeam === "Quester" ? "Monster" : "Quester";
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
};

export function getBattleRoll(diceArray) {
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

function boxPosition(occupiedTiles) {
  const newBox = Math.floor(Math.random() * 81);
  if (occupiedTiles.includes(newBox)) {
    return boxPosition(occupiedTiles);
  }
  occupiedTiles.push(newBox);
  return newBox;
}

export function getBoxRoll(result) {
  if (result === 12) {
    return { name: "Scroll of Lightning", type: "DMG", amount: 1 };
  } else if (result === 11) {
    return { name: "Fiery Spear", type: "ATK", amount: 2 };
  } else if (result === 10) {
    return { name: "Magic Armor", type: "DEF", amount: 2 };
  } else if (result === 9) {
    return { name: "Stealthy Dagger", type: "ATK", amount: 1 };
  } else if (result === 8) {
    return { name: "Pair of Gauntlets", type: "DEF", amount: 1 };
  } else if (result === 7) {
    return { name: "Spiked Mace", type: "ATK", amount: 1 };
  } else if (result === 6) {
    return { name: "Studded Helmet", type: "DEF", amount: 1 };
  } else if (result === 5) {
    return { name: "Healing Potion", type: "HP", amount: 1 };
  } else if (result === 4) {
    return { name: "Balm of Soothing", type: "HP", amount: 1 };
  } else {
    return null;
  }
}
