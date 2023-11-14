import { Client } from "boardgame.io/react";
import { DungeonHopper } from "../components/Game";
import { Board } from "../components/Board";

const ClientPage = Client({ game: DungeonHopper, board: Board });

export default ClientPage;
