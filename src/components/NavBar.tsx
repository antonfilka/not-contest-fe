import { useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { APP_ROUTES } from "@/navigation/routes.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import CartDrawer from "./CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { getCartIsEmpty, getTotalPrice } from "@/lib/cartOperations";
import { formatWithThousandDots } from "@/lib/utils";

interface NavBarProps {
  isMobile?: boolean;
}

const NavBar = ({ isMobile = false }: NavBarProps) => {
  const launchParams = useMemo(() => retrieveLaunchParams(), []);
  const location = useLocation();

  const cart = useCartStore((state) => state.items);
  const cartIsEmpty = getCartIsEmpty(cart);
  const totalPrice = getTotalPrice(cart);

  const user = launchParams.tgWebAppData?.user;
  const isProfilePage = location.pathname.includes(APP_ROUTES.PROFILE);

  const navHeight = useMemo(() => {
    if (!cartIsEmpty || isMobile) return "90px";
    return "70px";
  }, [cartIsEmpty, isMobile]);

  const userInitial = user?.first_name?.[0] || "";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center pt-[8px] bg-background"
      style={{ height: navHeight }}
    >
      {cartIsEmpty ? (
        <>
          {/* Store Link */}
          <NavLink
            to={APP_ROUTES.HOME}
            className="h-full w-[50%] flex flex-col items-center gap-[5px]"
            style={{ opacity: isProfilePage ? 0.6 : 1 }}
            viewTransition
            aria-label="Go to Store"
          >
            <NotcoinLogo />
            <span className="text-[10px] font-[500] leading-[12px]">Store</span>
          </NavLink>

          {/* Profile Link */}
          <NavLink
            to={APP_ROUTES.PROFILE}
            className="h-full w-[50%] flex flex-col items-center gap-[5px]"
            style={{ opacity: isProfilePage ? 1 : 0.6 }}
            aria-label="Go to Profile"
          >
            <Avatar>
              <AvatarImage
                src={user?.photo_url}
                alt={user?.first_name || "User"}
              />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-[500] leading-[12px]">
              {user?.first_name}
            </span>
          </NavLink>
        </>
      ) : (
        <CartDrawer>
          <Button className="grow h-[50px] bg-foreground text-background mx-[16px] text-[17px] font-[600] leading-[22px] mb-[34px]">
            Buy for {formatWithThousandDots(totalPrice)} NOT
          </Button>
        </CartDrawer>
      )}
    </nav>
  );
};

export default NavBar;

const NotcoinLogo = () => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99425 15.6719L11.4849 9.69654L11.4849 16.0067H8.20574C8.16688 16.0012 8.13028 15.9879 8.09832 15.9682C8.06073 15.9451 8.03083 15.9141 8.01014 15.8787C7.98947 15.8434 7.97866 15.8049 7.97741 15.7667C7.97636 15.7349 7.98191 15.7027 7.99425 15.6719Z"
      className="fill-foreground"
    />
    <path
      d="M16.7951 16.0067H13.5156L13.5156 9.69632L17.0066 15.6718C17.0188 15.7023 17.0244 15.7345 17.0233 15.7667C17.022 15.8054 17.0112 15.8438 16.9907 15.8787C16.9702 15.9138 16.9403 15.9449 16.9024 15.9682C16.8703 15.9879 16.8338 16.0012 16.7951 16.0067Z"
      className="fill-foreground"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 24C19.1274 24 24.5 18.6274 24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 18.6274 5.87258 24 12.5 24ZM13.377 5.43317C13.1949 5.12155 12.8611 4.92998 12.5002 4.92999C12.1393 4.92999 11.8055 5.12157 11.6235 5.4332L6.21765 14.6871C6.20656 14.706 6.19609 14.7254 6.18626 14.745C6.01776 15.0819 5.93532 15.4558 5.94773 15.8334C5.96015 16.211 6.06696 16.5786 6.25702 16.9037C6.44707 17.2288 6.71451 17.5014 7.03502 17.6984C7.35538 17.8953 7.71886 18.0105 8.09314 18.0352C8.11543 18.0367 8.13777 18.0375 8.16011 18.0375H16.8407C16.8631 18.0375 16.8854 18.0367 16.9077 18.0352C17.2821 18.0105 17.6454 17.8952 17.9657 17.6984C18.2859 17.5016 18.5536 17.2291 18.7438 16.9037C18.9342 16.5782 19.0406 16.2105 19.053 15.8334C19.0654 15.4563 18.9833 15.0824 18.8146 14.745C18.8048 14.7254 18.7943 14.706 18.7832 14.687L13.377 5.43317Z"
      className="fill-foreground"
    />
  </svg>
);
