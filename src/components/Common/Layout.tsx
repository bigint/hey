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
import AmbientBackground from "./AmbientBackground";
import ReloadTabsWatcher from "./ReloadTabsWatcher";

const GlobalModals = lazy(() => import("@/components/Shared/GlobalModals"));

const STORAGE_KEY = "hey:scrollPositions";

const loadPositions = (): Map<string, number> => {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    return new Map(Object.entries(JSON.parse(raw) as Record<string, number>));
  } catch {
    return new Map();
  }
};

const scrollPositions = loadPositions();

const persistPositions = () => {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(scrollPositions))
    );
  } catch {
    // sessionStorage may be unavailable (private mode, quota); fail silently
  }
};

const Layout = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const isMounted = useIsClient();
  const { accessToken } = hydrateAuthTokens();
  const pathnameRef = useRef(pathname);
  const lastNavAtRef = useRef(0);
  pathnameRef.current = pathname;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let rafId: number | null = null;
    const handleScroll = () => {
      // Ignore auto-scrolls triggered by route changes (doc shrinks → scrollY=0)
      if (performance.now() - lastNavAtRef.current < 500) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        scrollPositions.set(pathnameRef.current, window.scrollY);
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleBeforeUnload = () => persistPositions();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (rafId !== null) cancelAnimationFrame(rafId);
      persistPositions();
    };
  }, []);

  useEffect(() => {
    lastNavAtRef.current = performance.now();
    const saved = scrollPositions.get(pathname);

    if (navigationType !== "POP" || !saved || saved <= 0) {
      window.scrollTo(0, 0);
      return;
    }

    let cancelled = false;
    let observer: MutationObserver | null = null;
    const deadline = performance.now() + 4000;

    const attempt = () => {
      if (cancelled) return;
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const target = Math.min(saved, max);
      if (Math.abs(window.scrollY - target) > 1) {
        window.scrollTo(0, target);
      }
      if (Math.abs(window.scrollY - saved) < 2) {
        observer?.disconnect();
        return;
      }
      if (performance.now() > deadline) {
        observer?.disconnect();
        return;
      }
      requestAnimationFrame(attempt);
    };

    // Trigger an extra attempt whenever new content streams into the DOM
    observer = new MutationObserver(() => attempt());
    observer.observe(document.body, { childList: true, subtree: true });

    requestAnimationFrame(attempt);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
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
      <AmbientBackground />
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
