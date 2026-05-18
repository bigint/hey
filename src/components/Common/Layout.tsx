import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useIsClient } from "@uidotdev/usehooks";
import { lazy, memo, Suspense, useCallback, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router";
import { Toaster, type ToasterProps } from "sonner";
import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import Navbar from "@/components/Shared/Navbar";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import { Spinner } from "@/components/Shared/UI";
import reloadAllTabs from "@/helpers/reloadAllTabs";
import { useTheme } from "@/hooks/useTheme";
import { useMeQuery } from "@/indexer/generated";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { hydrateAuthTokens, signOut } from "@/store/persisted/useAuthStore";
import ReloadTabsWatcher from "./ReloadTabsWatcher";

const GlobalModals = lazy(() => import("@/components/Shared/GlobalModals"));

const scrollPositions = new Map<string, number>();

const Layout = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const isMounted = useIsClient();
  const { accessToken } = hydrateAuthTokens();
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handleSave = () => {
      scrollPositions.set(previousPathRef.current, window.scrollY);
    };
    window.addEventListener("beforeunload", handleSave);
    return () => window.removeEventListener("beforeunload", handleSave);
  }, []);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    if (previousPath !== pathname) {
      scrollPositions.set(previousPath, window.scrollY);
    }

    if (navigationType === "POP" && scrollPositions.has(pathname)) {
      const target = scrollPositions.get(pathname) ?? 0;
      const restore = () => window.scrollTo(0, target);
      restore();
      const raf = requestAnimationFrame(restore);
      const timeout = window.setTimeout(restore, 80);
      previousPathRef.current = pathname;
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(timeout);
      };
    }

    window.scrollTo(0, 0);
    previousPathRef.current = pathname;
  }, [pathname, navigationType]);

  const onError = useCallback(() => {
    signOut();
    reloadAllTabs();
  }, []);

  const { loading } = useMeQuery({
    onCompleted: ({ me }) => {
      setCurrentAccount(me.loggedInAs.account);
    },
    onError,
    skip: !accessToken
  });

  const accountLoading = !currentAccount && loading;

  if (accountLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Toaster
        icons={{
          error: <XCircleIcon className="size-5" />,
          loading: <Spinner size="xs" />,
          success: <CheckCircleIcon className="size-5" />
        }}
        position="bottom-right"
        theme={theme as ToasterProps["theme"]}
        toastOptions={{
          className: "font-sofia-pro",
          style: { boxShadow: "none", fontSize: "16px" }
        }}
      />
      <Suspense fallback={null}>
        <GlobalModals />
      </Suspense>
      <GlobalAlerts />
      <ReloadTabsWatcher />
      <div className="mx-auto flex w-full max-w-6xl items-start gap-x-8 px-0 md:px-5">
        <Navbar />
        <Outlet />
        <BottomNavigation />
      </div>
    </>
  );
};

export default memo(Layout);
