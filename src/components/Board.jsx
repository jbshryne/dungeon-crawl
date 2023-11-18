import { useEffect, useState } from "react";
import BattleDie from "./BattleDie";
import {
  GiFishMonster,
  GiSwordwoman,
  GiDiceSixFacesOne,
  GiDiceSixFacesTwo,
  GiDiceSixFacesThree,
  GiDiceSixFacesFour,
  GiDiceSixFacesFive,
  GiDiceSixFacesSix,
  GiCheckMark,
  GiChest,
} from "react-icons/gi";

export function Board({ ctx, G, moves, events }) {
  const [p1Status, setP1Status] = useState(G.messages.p1);
  const [p2Status, setP2Status] = useState(G.messages.p2);
  const [p1BattleDice, setP1BattleDice] = useState(G.battleDice.p1);
  const [p2BattleDice, setP2BattleDice] = useState(G.battleDice.p2);
  const [movementRoll, setMovementRoll] = useState([]);
  const [hoveredTile, setHoveredTile] = useState(null);
  const boardTiles = G.tiles.length;
  const currentPlayer = G.players[ctx.currentPlayer];
  const currentPosition = currentPlayer.position;
  const currentPlayerTeam = currentPlayer.team;

  useEffect(() => {
    setP1Status(G.messages.p1);
  }, [G.messages.p1]);

  useEffect(() => {
    setP2Status(G.messages.p2);
  }, [G.messages.p2]);

  useEffect(() => {
    setP1BattleDice(G.battleDice.p1);
  }, [G.battleDice.p1]);

  useEffect(() => {
    setP2BattleDice(G.battleDice.p2);
  }, [G.battleDice.p2]);

  useEffect(() => {
    setMovementRoll(G.movementDice);
  }, [G.movementDice]);

  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();
    const movementKeys = [
      "w",
      "a",
      "s",
      "d",
      "arrowup",
      "arrowleft",
      "arrowdown",
      "arrowright",
    ];

    if (movementKeys.includes(key)) {
      event.preventDefault(); // Prevent page scrolling on arrow key presses

      let newTile;
      switch (key) {
        case "w":
        case "arrowup":
          newTile = currentPosition - Math.sqrt(boardTiles);
          break;
        case "a":
        case "arrowleft":
          newTile = currentPosition - 1;
          break;
        case "s":
        case "arrowdown":
          newTile = currentPosition + Math.sqrt(boardTiles);
          break;
        case "d":
        case "arrowright":
          newTile = currentPosition + 1;
          break;
        default:
          break;
      }

      if (isAdjacentTile(newTile, currentPosition, boardTiles)) {
        if (G.tiles[newTile] === null) {
          moves.moveOneSquare(newTile);
        } else if (G.tiles[newTile] === "BOX") {
          moves.openBox(newTile);
        } else if (G.tiles[newTile].team !== currentPlayerTeam) {
          moves.attack(newTile);
        }
      }
    }
  };

  const onClick = (tileIdx) => {
    if (isAdjacentTile(tileIdx, currentPosition, boardTiles)) {
      if (G.tiles[tileIdx] === null) {
        moves.moveOneSquare(tileIdx);
      } else if (G.tiles[tileIdx] === "BOX") {
        moves.openBox(tileIdx);
      } else if (G.tiles[tileIdx].team !== currentPlayerTeam) {
        moves.attack(tileIdx);
      }
    }
  };

  const onTileHover = (tileIdx) => {
    if (isAdjacentTile(tileIdx, currentPosition, boardTiles)) {
      setHoveredTile(tileIdx);
    } else {
      setHoveredTile(null);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line
  }, [currentPosition, boardTiles, moves]);

  let tbody = [];
  for (let i = 0; i < Math.sqrt(boardTiles); i++) {
    let tiles = [];
    for (let j = 0; j < Math.sqrt(boardTiles); j++) {
      const idx = Math.sqrt(boardTiles) * i + j;

      const isAdjacent = isAdjacentTile(idx, currentPosition, boardTiles);
      const isOpponent =
        isAdjacent &&
        G.tiles[idx] !== null &&
        G.players.find((player) => G.tiles[idx] === player.team) &&
        G.players.find((player) => G.tiles[idx] === player.team) !==
          currentPlayer.team;
      const isItem = isAdjacent && G.tiles[idx] === "BOX";

      const tileContent = G.tiles[idx];

      const renderTileContent = (content) => {
        if (content === "Quester") {
          return <GiSwordwoman className="board-icon player-icon" />;
        } else if (content === "Monster") {
          return <GiFishMonster className="board-icon player-icon" />;
        } else if (content === "BOX") {
          return <GiChest className="board-icon box-icon" />;
        } else {
          return content;
        }
      };

      tiles.push(
        <td key={idx}>
          <div
            className={`tile ${isAdjacent && "adjacent"} ${
              idx === hoveredTile && "hovered"
            } ${isOpponent && "opponent"} ${isItem && "item"}`}
            onClick={() => onClick(idx)}
            onMouseEnter={() => onTileHover(idx)}
            onMouseLeave={() => setHoveredTile(null)}
          >
            {/* {G.tiles[idx]} */}
            {renderTileContent(tileContent)}
          </div>
        </td>
      );
    }
    tbody.push(<tr key={i}>{tiles}</tr>);
  }

  const PlayerPanel = ({ player, status, battleDice, movementDice }) => {
    const name = player.name;
    const hitPoints = player.hitPoints;
    const attackDice = player.attackDice + player.attackBoost;
    const defenseDice = player.defenseDice + player.defenseBoost;
    const movement = player.moveTiles;
    const action = player.hasDoneAction;
    const powerup = player.powerup;
    const isCurrentPlayer = currentPlayer.name === name;

    return (
      <div className={`player-panel ${isCurrentPlayer && "active"}`}>
        <section className="player-status-section">
          <p className="player-name">
            {name === "Quester" ? (
              <GiSwordwoman style={{ fontSize: 30 }} />
            ) : (
              <GiFishMonster style={{ fontSize: 30 }} />
            )}{" "}
            {name}
          </p>
        </section>
        <section className="player-status-section">
          <span>MOVEMENT ROLL</span>
          <div className="movement-die-container">
            {isCurrentPlayer && renderMovementRoll(movementDice)}
          </div>
        </section>
        <section className="player-status-section">
          <table className="player-stats">
            <thead>
              <tr>
                <th>Moves Left</th>
                <th>Action Taken</th>
                <th>Attack Dice</th>
                <th>Defense Dice</th>
                <th>Hit Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{movement}</td>
                <td>{action ? <GiCheckMark style={{ size: 36 }} /> : ""}</td>
                <td>{attackDice}</td>
                <td>{defenseDice}</td>
                <td>{hitPoints}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="player-status-section">
          <span>BATTLE ROLL</span>
          <div className="battle-die-container">
            {renderBattleRoll(battleDice, isCurrentPlayer)}
          </div>
        </section>
        <span>
          POWERUP: {powerup ? <b>{powerup.name}</b> : "None"}{" "}
          {powerup && powerup.type === "ATK" && (
            <i>(+{powerup.amount} to Attack Dice)</i>
          )}
          {powerup && powerup.type === "DEF" && (
            <i>(+{powerup.amount} to Defense Dice)</i>
          )}
        </span>
        <section>
          <button
            onClick={() => events.endTurn()}
            className={currentPlayer.name !== name ? "disabled" : ""}
          >
            End Turn
          </button>
        </section>
      </div>
    );
  };

  return (
    <div className="play-screen">
      <PlayerPanel
        player={G.players[0]}
        status={p1Status}
        battleDice={p1BattleDice}
        movementDice={movementRoll}
      />
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      <PlayerPanel
        player={G.players[1]}
        status={p2Status}
        battleDice={p2BattleDice}
        movementDice={movementRoll}
      />
    </div>
  );
}

export function isAdjacentTile(newTile, refTile, boardSize) {
  const rowSize = Math.sqrt(boardSize);

  // Check if the tiles are in the same row
  const sameRow =
    Math.floor(newTile / rowSize) === Math.floor(refTile / rowSize);

  // Check if the tiles are in the same column
  const sameColumn = newTile % rowSize === refTile % rowSize;

  return (
    (sameRow && Math.abs(newTile - refTile) === 1) || // Same row, adjacent columns
    (sameColumn && Math.abs(newTile - refTile) === rowSize) // Same column, adjacent rows
  );
}

export function getAdjacentTiles(tileIdx, boardSize) {
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

  return adjacentTiles;
}

export function calculateMoveTiles(startTile, targetTile, boardSize) {
  const rowSize = Math.sqrt(boardSize);

  // Get the x, y coordinates of the start and target tiles
  const start = { x: Math.floor(startTile / rowSize), y: startTile % rowSize };
  const target = {
    x: Math.floor(targetTile / rowSize),
    y: targetTile % rowSize,
  };

  // Calculate the Manhattan distance
  const distance = Math.abs(start.x - target.x) + Math.abs(start.y - target.y);

  return distance;
}

function renderMovementRoll(roll) {
  return roll.map((die, idx) => {
    if (die === 1) {
      return <GiDiceSixFacesOne key={idx} className="movement-die" />;
    }
    if (die === 2) {
      return <GiDiceSixFacesTwo key={idx} className="movement-die" />;
    }
    if (die === 3) {
      return <GiDiceSixFacesThree key={idx} className="movement-die" />;
    }
    if (die === 4) {
      return <GiDiceSixFacesFour key={idx} className="movement-die" />;
    }
    if (die === 5) {
      return <GiDiceSixFacesFive key={idx} className="movement-die" />;
    }
    if (die === 6) {
      return <GiDiceSixFacesSix key={idx} className="movement-die" />;
    }
  });
}

function renderBattleRoll(roll, isAttacking) {
  // console.log(roll);
  return roll.map((die, idx) => {
    return <BattleDie key={idx} result={die} isAttacking={isAttacking} />;
  });
}
