import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Auth from "./pages/Auth";
import Client from "./pages/Client";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/auth" element={<Auth />} />
      <Route path="/game" element={<Client />} />
    </Route>
  )
);

export default router;
