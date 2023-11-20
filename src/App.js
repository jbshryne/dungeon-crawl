// import { Outlet } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
// import AuthChecker from "./components/AuthChecker";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Client from "./pages/Client";
import Rules from "./pages/Rules";

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
              <Client />
              // </AuthChecker>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
