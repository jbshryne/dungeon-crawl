import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  // We will use the Route component to specify each route
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
