import { useState } from "react";
// import { DungeonHopper } from "./Game";

export function Board({ ctx, G, moves }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const currentPlayer = G.players[ctx.currentPlayer];
  const currentPosition = G.players[ctx.currentPlayer].position;
  const boardTiles = G.tiles.length;

  const onClick = (tileIdx) => {
    if (tileIdx === currentPosition) {
      getAccessibleTiles(
        currentPosition,
        currentPlayer.moveTiles,
        G.tiles.length
      );
    }

    if (
      isAdjacentTile(tileIdx, currentPosition, boardTiles) &&
      G.players[ctx.currentPlayer].moveTiles > 0
    ) {
      moves.moveOneSquare(tileIdx);
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

// export function isAdjacentTile(newTile, refTile, boardTiles) {
//   const adjacentTiles = [
//     refTile - Math.sqrt(boardTiles),
//     refTile + Math.sqrt(boardTiles),
//     refTile - 1,
//     refTile + 1,
//   ];

//   return adjacentTiles.includes(newTile);
// }

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

export function getAccessibleTiles(
  currentPosition,
  moveTilesLeft,
  boardTiles,
  visited = {}
) {
  if (moveTilesLeft === 0) {
    return [currentPosition];
  }

  const adjacentTiles = [
    currentPosition - Math.sqrt(boardTiles),
    currentPosition + Math.sqrt(boardTiles),
    currentPosition - 1,
    currentPosition + 1,
  ];
  const accessibleTiles = [];

  for (const adjacentTile of adjacentTiles) {
    if (
      isAdjacentTile(adjacentTile, currentPosition, boardTiles) &&
      adjacentTile >= 0 &&
      adjacentTile < boardTiles &&
      !visited[adjacentTile]
    ) {
      const newVisited = { ...visited, [adjacentTile]: true };
      const tilesFromAdjacent = getAccessibleTiles(
        adjacentTile,
        moveTilesLeft - 1,
        boardTiles,
        newVisited
      );
      accessibleTiles.push(...tilesFromAdjacent);
    }
  }

  const uniqueAccessibleTiles = [...new Set(accessibleTiles)];
  console.log(currentPosition, uniqueAccessibleTiles);

  return uniqueAccessibleTiles;
}
