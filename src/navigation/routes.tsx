import { HomePage } from "@/pages/HomePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RouteProps } from "react-router";
import { ItemDetailsPage } from "@/pages/ItemDetailsPage";

export const APP_ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  ITEM_DETAILS: "/item-details",
};

export const routes: RouteProps[] = [
  { path: APP_ROUTES.HOME, Component: HomePage },
  { path: APP_ROUTES.PROFILE, Component: ProfilePage },
  { path: APP_ROUTES.ITEM_DETAILS + "/:id", Component: ItemDetailsPage },
];
