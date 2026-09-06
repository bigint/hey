import { useApolloClient } from "@apollo/client";
import {
  BellIcon,
  GlobeAltIcon as GlobeOutline,
  HomeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  GlobeAltIcon as GlobeSolid,
  HomeIcon as HomeIconSolid
} from "@heroicons/react/24/solid";
import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Image } from "@/components/Shared/UI";
import getAvatar from "@/helpers//getAvatar";
import useHasNewNotifications from "@/hooks/useHasNewNotifications";
import {
  NotificationIndicatorDocument,
  NotificationsDocument
} from "@/indexer/generated";
import { useMobileDrawerModalStore } from "@/store/non-persisted/modal/useMobileDrawerModalStore";
import { useNewPostModalStore } from "@/store/non-persisted/modal/useNewPostModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useNotificationStore } from "@/store/persisted/useNotificationStore";
import MobileDrawerMenu from "./MobileDrawerMenu";

interface NavigationItemProps {
  path: string;
  label: string;
  outline: ReactNode;
  solid: ReactNode;
  isActive: boolean;
  onClick?: (e: MouseEvent) => void;
  showIndicator?: boolean;
}

const NavigationItem = ({
  path,
  label,
  outline,
  solid,
  isActive,
  onClick,
  showIndicator
}: NavigationItemProps) => (
  <Link
    aria-label={label}
    className="relative mx-auto my-3"
    onClick={onClick}
    to={path}
  >
    {isActive ? solid : outline}
    {showIndicator && (
      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
    )}
  </Link>
);

const BottomNavigation = () => {
  const { pathname } = useLocation();
  const { currentAccount } = useAccountStore();
  const client = useApolloClient();
  const { show: showMobileDrawer, setShow: setShowMobileDrawer } =
    useMobileDrawerModalStore();
  const { setShow: setShowNewPostModal } = useNewPostModalStore();
  const hasNewNotifications = useHasNewNotifications();
  const { incrementNotificationRefreshSignal } = useNotificationStore();

  const handleAccountClick = () => setShowMobileDrawer(true);

  const handleNewPostClick = () => {
    umami.track("open_composer");
    setShowNewPostModal(true);
  };

  const handleNavigationClick = async (path: string, e: MouseEvent) => {
    if (path === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo(0, 0);
    }
    if (path === "/notifications" && pathname === "/notifications") {
      e.preventDefault();
      window.scrollTo(0, 0);
      incrementNotificationRefreshSignal();
      await client.refetchQueries({
        include: [NotificationsDocument, NotificationIndicatorDocument]
      });
    }
  };

  const navigationItems = [
    {
      label: "Home",
      outline: <HomeIcon className="size-6" />,
      path: "/",
      solid: <HomeIconSolid className="size-6" />
    },
    {
      label: "Search",
      outline: <MagnifyingGlassIcon className="size-6" />,
      path: "/search",
      solid: <MagnifyingGlassIcon className="size-6" />
    },
    {
      label: "Explore",
      outline: <GlobeOutline className="size-6" />,
      path: "/explore",
      solid: <GlobeSolid className="size-6" />
    },
    {
      label: "Notifications",
      outline: <BellIcon className="size-6" />,
      path: "/notifications",
      solid: <BellIconSolid className="size-6" />
    }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[5] border-gray-200 border-t bg-white pb-safe md:hidden dark:border-gray-800 dark:bg-black">
      {showMobileDrawer && <MobileDrawerMenu />}
      <div className="flex justify-between">
        {navigationItems.map(({ path, label, outline, solid }) => (
          <NavigationItem
            isActive={pathname === path}
            key={path}
            label={label}
            onClick={(e) => {
              void handleNavigationClick(path, e);
            }}
            outline={outline}
            path={path}
            showIndicator={hasNewNotifications && path === "/notifications"}
            solid={solid}
          />
        ))}
        {currentAccount && (
          <>
            <button
              aria-label="Create post"
              className="m-auto h-fit"
              onClick={handleNewPostClick}
              type="button"
            >
              <PencilSquareIcon className="size-6" />
            </button>
            <button
              aria-label="Your account"
              className="m-auto h-fit"
              onClick={handleAccountClick}
              type="button"
            >
              <Image
                alt={currentAccount.address}
                className="m-0.5 size-6 rounded-full border border-gray-200 dark:border-gray-700"
                src={getAvatar(currentAccount)}
              />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;
