export function MovementTestBoard({ ctx, G, moves }) {
  const onClick = (tileIdx) => {
    if (
      isAdjacentTile(tileIdx, G.players[ctx.currentPlayer].position) &&
      G.players[ctx.currentPlayer].moveTiles > 0
    ) {
      moves.moveOneSquare(tileIdx);
    }
  };

  const tileStyle = {
    border: "1px solid gray",
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    textAlign: "center",
  };

  let tbody = [];
  for (let i = 0; i < 5; i++) {
    let tiles = [];
    for (let j = 0; j < 5; j++) {
      const id = 5 * i + j;
      tiles.push(
        <td key={id}>
          {/* {G.tiles[id] ? ( */}
          <div style={tileStyle} onClick={() => onClick(id)}>
            {G.tiles[id]}
          </div>
          {/* ) : (
            <button style={tileStyle} onClick={() => onClick(id)} />
          )} */}
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

function isAdjacentTile(newTile, refTile) {
  const adjacentTiles = [refTile - 5, refTile + 5, refTile - 1, refTile + 1];

  return adjacentTiles.includes(newTile);
}
