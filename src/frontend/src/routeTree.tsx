import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import AuthGuard from "./components/AuthGuard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import LeaderboardPage from "./pages/Leaderboard";
import LevelScreen from "./pages/LevelScreen";
import Levels from "./pages/Levels";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});

const levelsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/levels",
  component: Levels,
});

const levelRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/level/$id",
  component: LevelScreen,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    levelsRoute,
    levelRoute,
    leaderboardRoute,
    profileRoute,
  ]),
]);
