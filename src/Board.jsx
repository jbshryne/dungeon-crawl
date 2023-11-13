import { useEffect, useState } from "react";

export function Board({ ctx, G, moves }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const boardTiles = G.tiles.length;
  const currentPlayer = G.players[ctx.currentPlayer];
  const currentPosition = currentPlayer.position;

  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();
    console.log(key);
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
        } else {
          moves.attack(newTile);
        }
      }
    }
  };

  const onClick = (tileIdx) => {
    if (isAdjacentTile(tileIdx, currentPosition, boardTiles)) {
      if (G.tiles[tileIdx] === null) {
        moves.moveOneSquare(tileIdx);
      } else {
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
    // Attach the event listener when the component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Detach the event listener when the component unmounts
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
        G.players.find((player) => G.tiles[idx] === player.name).team !==
          currentPlayer.team;

      tiles.push(
        <td key={idx}>
          <div
            className={`tile ${isAdjacent && "adjacent"} ${
              idx === hoveredTile && "hovered"
            } ${isOpponent && "opponent"}`}
            onClick={() => onClick(idx)}
            onMouseEnter={() => onTileHover(idx)}
            onMouseLeave={() => setHoveredTile(null)}
          >
            {G.tiles[idx]}
          </div>
        </td>
      );
    }
    tbody.push(<tr key={i}>{tiles}</tr>);
  }

  return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      <p id="info-box"></p>
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
