import { HomePage } from "@/pages/HomePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RouteProps } from "react-router";
import { ItemDetailsPage } from "@/pages/ItemDetailsPage";
import { GamePage } from "@/pages/GamePage";

export const APP_ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  ITEM_DETAILS: "/item-details",
  GAME: "/game",
};

export const routes: RouteProps[] = [
  { path: APP_ROUTES.HOME, Component: HomePage },
  { path: APP_ROUTES.PROFILE, Component: ProfilePage },
  { path: APP_ROUTES.ITEM_DETAILS + "/:id", Component: ItemDetailsPage },
  { path: APP_ROUTES.GAME, Component: GamePage },
];
