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
      p1: { result: [], type: "" },
      p2: { result: [], type: "" },
    },
  }),

  moves: {
    moveOneSquare: ({ G, events, ctx, playerID }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

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
      }
    },

    toNewTile: ({ G, ctx, playerID }, tileIdx, distance) => {
      const currentPlayer = G.players[playerID];
      const currentPosition = currentPlayer.position;
      const currentPlayerName = currentPlayer.name;

      if (!currentPlayer.hasMoved) {
        if (distance <= currentPlayer.moveTiles) {
          G.tiles[currentPosition] = null;
          G.tiles[tileIdx] = currentPlayerName;
          G.players[playerID].position = tileIdx;
          currentPlayer.moveTiles -= distance;
          currentPlayer.isMoving = true;
        } else {
          G.messages.game = "You can't move that far!";
        }
      }
      if (currentPlayer.moveTiles === 0) {
        currentPlayer.isMoving = false;
        currentPlayer.hasMoved = true;
      }
    },

    attack: ({ G, ctx, playerID, random }, tileIdx) => {
      const currentPlayer = G.players[playerID];
      const currentPlayerName = currentPlayer.name;
      const currentPlayerTeam = currentPlayer.team;
      const isPlayer1 = playerID === "0";
      // let isActivePlayer;

      // if (isMultiplayer) {
      //   isActivePlayer = playerID === ctx.currentPlayer;
      //   console.log("isActivePlayer", isActivePlayer);
      // }

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
        currentPlayer.hasDoneAction = true;
        const attackRoll = getBattleRoll(
          random.D6(currentPlayer.attackDice + currentPlayer.attackBoost),
          "atk"
        );
        const defenseRoll = getBattleRoll(
          random.D6(attackedPlayer.defenseDice + attackedPlayer.defenseBoost),
          "def"
        );

        const attackTotal = attackRoll.result.filter(
          (die) => die === "atk"
        ).length;
        const defenseTotal = defenseRoll.result.filter(
          (die) => die === "def"
        ).length;

        if (isPlayer1) {
          G.battleDice.p1 = attackRoll;
          G.battleDice.p2 = defenseRoll;
        } else {
          G.battleDice.p2 = attackRoll;
          G.battleDice.p1 = defenseRoll;
        }

        let baseDamage = attackTotal - defenseTotal;
        let damage = 0;

        if (baseDamage > 0) {
          damage = baseDamage;
          if (attackedPlayer.powerup) {
            damage -= 1;
          }
          attackedPlayer.hitPoints -= damage;

          const hitText = getHitTextArray(damage)[random.D4(1)[0] - 1];

          G.messages.game = `${currentPlayer.name} attacks ... and ${hitText} ${attackedPlayerName} takes ${damage} damage.`;
          if (attackedPlayer.powerup && baseDamage > 0) {
            G.messages.game += ` (The ${attackedPlayer.powerup.name} absorbs 1 damage, but is lost!)`;
          }
        } else {
          G.messages.game = `${currentPlayer.name} attacks ... and it misses!`;
        }

        if (attackedPlayer.powerup && baseDamage > 0) {
          attackedPlayer.powerup = null;
          attackedPlayer.attackBoost = 0;
          attackedPlayer.defenseBoost = 0;
        }

        if (attackedPlayer.hitPoints <= 0) {
          G.tiles[tileIdx] = null;
          attackedPlayer.position = null;
          G.messages.game = `${attackedPlayerName} is defeated! ${currentPlayerName} WINS!`;
        }

        if (currentPlayer.isMoving) {
          currentPlayer.isMoving = false;
          currentPlayer.hasMoved = true;
        }
        // } else if (currentPlayerTeam === attackedPlayerTeam) {
        //   console.log("You can't attack your own team!");
      } else if (currentPlayer.hasDoneAction) {
        G.messages.game = "You have already performed an action this turn!";
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
        currentPlayer.hasDoneAction = true;
        G.tiles[tileIdx] = null;
        const boxRoll = random.D12(1);
        const boxRollResult = getBoxRoll(boxRoll[0]);

        if (boxRollResult) {
          if (boxRollResult.type === "HP") {
            currentPlayer.hitPoints += boxRollResult.amount;
            G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} and gains ${boxRollResult.amount} hit point!`;
          } else if (boxRollResult.type === "DMG") {
            if (opponent.powerup) {
              opponent.powerup = null;
              opponent.attackBoost = 0;
              opponent.defenseBoost = 0;
              G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} -- ${opponent.name}'s ${opponent.powerup.name} absorbs the damage, but is lost!`;
            } else {
              opponent.hitPoints -= boxRollResult.amount;
              G.messages.game = `${currentPlayerName} finds a ${boxRollResult.name} -- ${opponent.name} is struck and loses ${boxRollResult.amount} hit point!`;
              if (opponent.hitPoints <= 0) {
                G.tiles[opponent.position] = null;
                opponent.position = null;
                G.messages.game += ` ${currentPlayerName} WINS!`;
              }
            }
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
      sessionStorage.removeItem("dungeon-throwdown_openedBox");
      const currentPlayer = G.players[ctx.currentPlayer];
      currentPlayer.isMoving = false;
      currentPlayer.hasMoved = false;
      currentPlayer.hasDoneAction = false;

      const movementRoll = random.D6(2);
      const movementTotal = movementRoll[0] + movementRoll[1];
      currentPlayer.moveTiles = movementTotal;
      // console.log(
      //   `${currentPlayer.name} rolled ${movementRoll[0]} and ${movementRoll[1]} for a total of ${movementTotal} movement tiles`
      // );
      G.movementDice = movementRoll;

      const occupiedTiles = G.tiles.map((tile, idx) => {
        if (tile !== null) {
          return idx;
        } else {
          return null;
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
      currentPlayer.isMoving = false;
      currentPlayer.hasMoved = false;
      currentPlayer.hasDoneAction = false;
      currentPlayer.moveTiles = 0;
    },

    endIf: ({ G, ctx }) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      return (
        !currentPlayer.isMoving &&
        currentPlayer.hasMoved &&
        (currentPlayer.hasDoneAction ||
          getAdjacentTiles(currentPlayer.position, G.tiles.length).every(
            (tile) => {
              return G.tiles[tile] === null;
            }
          ))
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
      return { winner: currentTeam };
    }
  },
};

function getAdjacentTiles(tileIdx, boardSize) {
  const rowSize = Math.sqrt(boardSize);
  const sameRow = Math.floor(tileIdx / rowSize);
  const sameColumn = tileIdx % rowSize;
  const adjacentTiles = [];

  if (sameRow > 0) {
    adjacentTiles.push(tileIdx - rowSize);
  }
  if (sameRow < rowSize - 1) {
    adjacentTiles.push(tileIdx + rowSize);
  }
  if (sameColumn > 0) {
    adjacentTiles.push(tileIdx - 1);
  }
  if (sameColumn < rowSize - 1) {
    adjacentTiles.push(tileIdx + 1);
  }

  // console.log(adjacentTiles);

  return adjacentTiles;
}

function getHitTextArray(damage) {
  const hitTextArray = [];
  if (damage <= 1) {
    hitTextArray.push("IT CONNECTS!", "SUCCESS!", "GOT 'EM!", "NICE!");
  } else if ((damage = 2)) {
    hitTextArray.push("BOOM!", "WHAM!", "OUCH!", "OOF!");
  } else if (damage >= 3) {
    hitTextArray.push("KAPOW!", "WOW!", "AMAZING!", "INCREDIBLE!");
  }
  return hitTextArray;
}

function boxPosition(occupiedTiles) {
  const newBox = Math.floor(Math.random() * 81);
  if (occupiedTiles.includes(newBox)) {
    return boxPosition(occupiedTiles);
  }
  occupiedTiles.push(newBox);
  return newBox;
}

function getBattleRoll(diceArray, type) {
  const dice = diceArray.map((die) => {
    if (die === 1) {
      return "blank";
    } else if (die === 2 || die === 3) {
      return "def";
    } else {
      return "atk";
    }
  });
  return { result: dice, type };
}

function getBoxRoll(result) {
  // console.log("getBoxRoll", result);
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
