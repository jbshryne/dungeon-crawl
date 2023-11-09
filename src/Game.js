// export const MovementTest = () => {
//   setup: () => ({ cells: Array(9).fill(null) }),

//   moves: {
//     moveOneSquare: (G, ctx, id) => {
//       G.cells[id] = ctx.currentPlayer;
//     },
//   }
// }

import { INVALID_MOVE } from "boardgame.io/core";

function isSameTile(G, ctx, id) {
  const currentPlayerID = ctx.currentPlayer;

  return id === G.players[currentPlayerID].position;
}

export const MovementTest = {
  setup: () => ({ cells: Array(25).fill(null).fill("0", 22, 23) }),

  moves: {
    // clickCell: (G, ctx, id) => {
    // console.log(id, ctx.currentPlayer);
    // if ((G.cells[id] = ctx.currentPlayer)) {
    //   return alert("You clicked yourself!");
    // }
    // return INVALID_MOVE;
    // },
    clickCell: ({ G, playerID }, id) => {
      console.log(G.cells[id], playerID);
      // console.log(isSameTile(G, ctx, id));

      // if (G.cells[id] !== null) {
      //   return INVALID_MOVE;
      // }
      if (G.cells[id] === playerID) {
        alert("You clicked yourself!");
      }
      // console.log(id);
      // alert(typeof playerID);
    },
  },
};
