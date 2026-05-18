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
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const handleScroll = () => {
      scrollPositions.set(pathnameRef.current, window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = scrollPositions.get(pathname);
    if (navigationType === "POP" && saved !== undefined && saved > 0) {
      let cancelled = false;
      const start = performance.now();
      const tryRestore = () => {
        if (cancelled) return;
        const reachable =
          document.documentElement.scrollHeight - window.innerHeight;
        const target = Math.min(saved, Math.max(reachable, 0));
        window.scrollTo(0, target);
        const reachedSaved = Math.abs(window.scrollY - saved) < 2;
        const elapsed = performance.now() - start;
        if (!reachedSaved && elapsed < 3000) {
          requestAnimationFrame(tryRestore);
        }
      };
      requestAnimationFrame(tryRestore);
      return () => {
        cancelled = true;
      };
    }
    window.scrollTo(0, 0);
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
