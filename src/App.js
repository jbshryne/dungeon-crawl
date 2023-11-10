import { Client } from "boardgame.io/react";
import { DungeonHopper } from "./Game";
import { Board } from "./Board";
import "./App.css";

const App = Client({ game: DungeonHopper, board: Board });

export default App;
