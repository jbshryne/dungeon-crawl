import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
// import AuthChecker from "./components/AuthChecker";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Demo from "./pages/Demo";
import Multiplayer from "./pages/Multiplayer";
import Rules from "./pages/Rules";
import SelectAvatar from "./pages/SelectAvatar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rules" element={<Rules />} />
          <Route
            path="/game"
            element={
              // TEMPORARILY DISABLING AUTH CHECKER FOR DEMOING PURPOSES
              // <AuthChecker>
              <Demo />
              // </AuthChecker>
            }
          />
          <Route path="/select" element={<SelectAvatar />} />
          <Route path="/game/0" element={<Multiplayer playerID="0" />} />
          <Route path="/game/1" element={<Multiplayer playerID="1" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
