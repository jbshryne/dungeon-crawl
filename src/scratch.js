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

// AI TRAINING

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
