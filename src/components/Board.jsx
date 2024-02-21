import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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
import PF from "pathfinding";

export function Board({
  ctx,
  G,
  moves,
  events,
  playerID,
  isMultiplayer,
  reset,
}) {
  // declare state variables
  // console.log("useGSAP", useGSAP);
  const [p1Status, setP1Status] = useState(G.messages.p1);
  const [p2Status, setP2Status] = useState(G.messages.p2);
  const [p1BattleDice, setP1BattleDice] = useState(G.battleDice.p1);
  const [p2BattleDice, setP2BattleDice] = useState(G.battleDice.p2);
  const [movementRoll, setMovementRoll] = useState([]);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [pathTiles, setPathTiles] = useState([]);

  // declare variables
  const boardTiles = G.tiles.length;
  const currentPlayer = G.players[ctx.currentPlayer];
  const currentPosition = currentPlayer.position;
  const currentPlayerTeam = currentPlayer.team;

  // update state variables
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

  // event handlers
  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();
    const inputKeys = [
      // "w",
      // "a",
      // "s",
      // "d",
      // "arrowup",
      // "arrowleft",
      // "arrowdown",
      // "arrowright",
      "r",
      // "e",
      "enter",
    ];

    if (inputKeys.includes(key)) {
      event.preventDefault(); // Prevent page scrolling on arrow key presses

      // let newTile;
      switch (key) {
        // case "w":
        // case "arrowup":
        //   newTile = currentPosition - Math.sqrt(boardTiles);
        //   break;
        // case "a":
        // case "arrowleft":
        //   newTile = currentPosition - 1;
        //   break;
        // case "s":
        // case "arrowdown":
        //   newTile = currentPosition + Math.sqrt(boardTiles);
        //   break;
        // case "d":
        // case "arrowright":
        //   newTile = currentPosition + 1;
        //   break;
        // case "e":
        case "enter":
          events.endTurn();
          break;
        case "r":
          reset();
          break;
        default:
          break;
      }
    }
  };

  const onClick = (tileIdx) => {
    const moveTiles = calculateMoveTiles(
      G,
      currentPosition,
      tileIdx,
      boardTiles
    );
    if (isAdjacentTile(tileIdx, currentPosition, boardTiles)) {
      if (G.tiles[tileIdx] === "BOX") {
        moves.openBox(tileIdx);
        sessionStorage.setItem("dungeon-throwdown_openedBox", tileIdx);
      } else if (
        G.tiles[tileIdx] &&
        G.tiles[tileIdx].team !== currentPlayerTeam
      ) {
        moves.attack(tileIdx);
      } else {
        moves.moveOneSquare(tileIdx);
      }
    } else {
      // console.log("moveTiles", moveTiles);
      if (G.tiles[tileIdx] === null)
        moves.toNewTile(tileIdx, moveTiles.distance);
    }
  };

  const onTileHover = (tileIdx) => {
    let isActivePlayer;
    if (isMultiplayer) {
      isActivePlayer = playerID === ctx.currentPlayer;
    } else {
      isActivePlayer = true;
    }

    const moveInfo = calculateMoveTiles(
      G,
      currentPosition,
      tileIdx,
      boardTiles
    );
    if (currentPlayer.moveTiles >= moveInfo.path.length - 1 && isActivePlayer) {
      setPathTiles(moveInfo.path);
      if (moveInfo.path.includes(tileIdx)) setHoveredTile(tileIdx);
      // console.log("tileIdx in onTileHover", tileIdx);
    }
  };

  // // event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line
  }, [currentPosition, boardTiles, moves]);

  // render the board
  let tbody = [];
  for (let i = 0; i < Math.sqrt(boardTiles); i++) {
    let tiles = [];
    for (let j = 0; j < Math.sqrt(boardTiles); j++) {
      const idx = Math.sqrt(boardTiles) * i + j;

      const isAdjacent = isAdjacentTile(idx, currentPosition, boardTiles);
      const isOpponent =
        isAdjacent &&
        G.tiles[idx] !== null &&
        !currentPlayer.hasDoneAction &&
        G.players.find((player) => G.tiles[idx] === player.team) &&
        G.players.find((player) => G.tiles[idx] === player.team) !==
          currentPlayer.team;
      const isItem =
        isAdjacent && !currentPlayer.hasDoneAction && G.tiles[idx] === "BOX";

      const tileContent = G.tiles[idx];

      const renderTileContent = (content) => {
        if (content === "Quester") {
          return <GiSwordwoman className="board-icon player-icon" />;
        } else if (content === "Monster") {
          return <GiFishMonster className="board-icon player-icon" />;
        } else if (content === "BOX") {
          return <GiChest className="board-icon box-icon" />;
        } else {
          return null;
        }
      };

      tiles.push(
        <td key={idx}>
          <div
            className={`tile ${(hoveredTile === idx && "adjacent") || ""} ${
              (pathTiles.includes(idx) && "hovered") || ""
            } ${(isOpponent && "opponent") || ""} ${(isItem && "item") || ""}`}
            onClick={() => onClick(idx)}
            onMouseEnter={() => onTileHover(idx)}
            onMouseLeave={() => {
              setHoveredTile(null);
              setPathTiles([]);
            }}
          >
            {/* {G.tiles[idx]} */}
            {renderTileContent(tileContent)}
          </div>
        </td>
      );
    }
    tbody.push(<tr key={i}>{tiles}</tr>);
  }

  // info & status panel
  const PlayerPanel = ({ player, status, battleDice, movementDice }) => {
    const name = player.name;
    const hitPoints = player.hitPoints;
    const attackDice = player.attackDice + player.attackBoost;
    const defenseDice = player.defenseDice + player.defenseBoost;
    const movement = player.moveTiles;
    const action = player.hasDoneAction;
    const powerup = player.powerup;

    const isCurrentPlayer = currentPlayer.name === name;
    let isActivePlayer;
    let displayName;

    // console.log("name", name);
    // console.log("G.players[playerID]", G.players[playerID]);

    if (isMultiplayer) {
      isActivePlayer =
        currentPlayer.name === player.name && playerID === ctx.currentPlayer;
      displayName = name === G.players[playerID].name ? "You" : "Opponent";
    } else {
      isActivePlayer = isCurrentPlayer;
      displayName = name;
    }

    return (
      <div className={`player-panel ${isCurrentPlayer && "active"}`}>
        <section className="player-status-section">
          <p className="player-name">
            {name === "Quester" ? (
              <GiSwordwoman style={{ fontSize: 30 }} />
            ) : (
              <GiFishMonster style={{ fontSize: 30 }} />
            )}{" "}
            {displayName}
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
                <th className={(player.attackBoost && "boosted") || ""}>
                  Attack Dice
                </th>
                <th className={(player.defenseBoost && "boosted") || ""}>
                  Defense Dice
                </th>
                <th>Hit Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{movement}</td>
                <td>{action ? <GiCheckMark style={{ size: 36 }} /> : ""}</td>
                <td className={(player.attackBoost && "boosted") || ""}>
                  {attackDice}
                </td>
                <td className={(player.defenseBoost && "boosted") || ""}>
                  {defenseDice}
                </td>
                <td>{hitPoints}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="player-status-section">
          <span>BATTLE ROLL</span>
          <div className="battle-die-container">
            {renderBattleRoll(battleDice)}
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
        {/* <div className="controls"> */}
        <button
          onClick={() => events.endTurn()}
          className={!isActivePlayer ? "disabled" : ""}
        >
          End Turn
        </button>
        {/* </div> */}
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

export function calculateMoveTiles(G, startTile, targetTile, boardSize) {
  const rowSize = Math.sqrt(boardSize);

  const start = { x: Math.floor(startTile / rowSize), y: startTile % rowSize };
  const target = {
    x: Math.floor(targetTile / rowSize),
    y: targetTile % rowSize,
  };

  const occupiedTiles = [];
  G.tiles.forEach((tile, idx) => {
    if (tile !== null) {
      occupiedTiles.push(idx);
    }
  });

  const path = findPath(start, target, rowSize, occupiedTiles);

  // console.log("path from findAPath", path);

  if (!path) {
    console.log("No valid path found");
    return { moveTiles: [] };
  }

  // const distance = path.length - 1;

  return { path, distance: path.length - 1 };
}

function findPath(start, target, rowSize, occupiedTiles) {
  const grid2DArray = new PF.Grid(rowSize, rowSize);
  occupiedTiles.forEach((tile) => {
    const x = Math.floor(tile / rowSize);
    const y = tile % rowSize;
    grid2DArray.setWalkableAt(x, y, false);
  });

  // console.log("grid2DArray", grid2DArray);

  const finder = new PF.AStarFinder();
  const path = finder.findPath(
    start.x,
    start.y,
    target.x,
    target.y,
    grid2DArray
  );
  // console.log("path", path);

  // convert each square in grid2DArray to its corresponding index in the 1D array
  const convertedPath = path.map(([x, y]) => x * rowSize + y);
  // convertedPath.pop();

  return convertedPath;
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
    } else return <GiDiceSixFacesSix key={idx} className="movement-die" />;
  });
}

function renderBattleRoll(roll) {
  // console.log(roll);
  return roll.result.map((die, idx) => {
    return <BattleDie key={idx} result={die} type={roll.type} />;
  });
}
