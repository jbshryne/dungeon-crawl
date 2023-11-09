import { Client } from "boardgame.io/react";
import { MovementTest } from "./Game";
import { MovementTestBoard } from "./Board";

const App = Client({ game: MovementTest, board: MovementTestBoard });

export default App;
