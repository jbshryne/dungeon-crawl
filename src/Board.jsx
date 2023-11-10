import { useState } from "react";
// import { DungeonHopper } from "./Game";

export function Board({ ctx, G, moves }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const currentPlayer = G.players[ctx.currentPlayer];
  const currentPosition = G.players[ctx.currentPlayer].position;
  const boardTiles = G.tiles.length;

  const onClick = (tileIdx) => {
    // if (tileIdx === currentPosition) {
    //   getAccessibleTiles(
    //     currentPosition,
    //     currentPlayer.moveTiles,
    //     G.tiles.length
    //   );
    // }

    if (
      isAdjacentTile(tileIdx, currentPosition, boardTiles) &&
      currentPlayer.moveTiles > 0
    ) {
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

  let tbody = [];
  for (let i = 0; i < Math.sqrt(boardTiles); i++) {
    let tiles = [];
    for (let j = 0; j < Math.sqrt(boardTiles); j++) {
      const id = Math.sqrt(boardTiles) * i + j;
      const isAdjacent = isAdjacentTile(id, currentPosition, boardTiles);
      // const isAdjacent = getAccessibleTiles(
      //   currentPosition,
      //   currentPlayer.moveTiles,
      //   boardTiles
      // ).includes(id);
      tiles.push(
        <td key={id}>
          <div
            className={`tile ${isAdjacent && "adjacent"} ${
              id === hoveredTile && "hovered"
            }`}
            onClick={() => onClick(id)}
            onMouseEnter={() => onTileHover(id)}
            onMouseLeave={() => setHoveredTile(null)}
          >
            {G.tiles[id]}
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
