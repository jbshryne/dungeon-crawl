// export function getAccessibleTiles(
//   currentPosition,
//   moveTilesLeft,
//   boardTiles,
//   visited = {}
// ) {
//   if (moveTilesLeft === 0) {
//     return [currentPosition];
//   }

//   const adjacentTiles = [
//     currentPosition - Math.sqrt(boardTiles),
//     currentPosition + Math.sqrt(boardTiles),
//     currentPosition - 1,
//     currentPosition + 1,
//   ];
//   const accessibleTiles = [];

//   for (const adjacentTile of adjacentTiles) {
//     if (
//       isAdjacentTile(adjacentTile, currentPosition, boardTiles) &&
//       adjacentTile >= 0 &&
//       adjacentTile < boardTiles &&
//       !visited[adjacentTile]
//     ) {
//       const newVisited = { ...visited, [adjacentTile]: true };
//       const tilesFromAdjacent = getAccessibleTiles(
//         adjacentTile,
//         moveTilesLeft - 1,
//         boardTiles,
//         newVisited
//       );
//       accessibleTiles.push(...tilesFromAdjacent);
//     }
//   }

//   const uniqueAccessibleTiles = [...new Set(accessibleTiles)];
//   // console.log(currentPosition, uniqueAccessibleTiles);

//   return uniqueAccessibleTiles;
// }
