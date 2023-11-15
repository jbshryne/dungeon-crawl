import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Auth from "./pages/Auth";
import Client from "./pages/Client";
import AuthChecker from "./components/AuthChecker";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/game"
        element={
          <AuthChecker>
            <Client />
          </AuthChecker>
        }
      />
    </Route>
  )
);

export default router;
