import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import Layout from "@/components/Common/Layout";
import FullPageLoader from "@/components/Shared/FullPageLoader";

const AccountMonetizeSettings = lazy(
  () => import("@/components/Settings/Monetize")
);
const AccountPersonalizeSettings = lazy(
  () => import("@/components/Settings/Personalize")
);
const AccountSettings = lazy(() => import("@/components/Settings"));
const BlockedSettings = lazy(() => import("@/components/Settings/Blocked"));
const Bookmarks = lazy(() => import("@/components/Bookmarks"));
const Copyright = lazy(() => import("@/components/Pages/Copyright"));
const Custom404 = lazy(() => import("@/components/Shared/404"));
const DeveloperSettings = lazy(() => import("@/components/Settings/Developer"));
const Explore = lazy(() => import("@/components/Explore"));
const GroupMonetizeSettings = lazy(
  () => import("@/components/Group/Settings/Monetize")
);
const GroupPersonalizeSettings = lazy(
  () => import("@/components/Group/Settings/Personalize")
);
const GroupSettings = lazy(() => import("@/components/Group/Settings"));
const Groups = lazy(() => import("@/components/Groups"));
const Guidelines = lazy(() => import("@/components/Pages/Guidelines"));
const Home = lazy(() => import("@/components/Home"));
const ManagerSettings = lazy(() => import("@/components/Settings/Manager"));
const Notification = lazy(() => import("@/components/Notification"));
const Privacy = lazy(() => import("@/components/Pages/Privacy"));
const RewardsSettings = lazy(() => import("@/components/Settings/Rewards"));
const RulesSettings = lazy(() => import("@/components/Group/Settings/Rules"));
const Search = lazy(() => import("@/components/Search"));
const SessionsSettings = lazy(() => import("@/components/Settings/Sessions"));
const Support = lazy(() => import("@/components/Pages/Support"));
const Terms = lazy(() => import("@/components/Pages/Terms"));
const UsernameSettings = lazy(() => import("@/components/Settings/Username"));
const ViewAccount = lazy(() => import("@/components/Account"));
const ViewGroup = lazy(() => import("@/components/Group"));
const ViewPost = lazy(() => import("@/components/Post"));

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <RouterRoutes>
          <Route element={<Layout />} path="/">
            <Route element={<Home />} index />
            <Route element={<Explore />} path="explore" />
            <Route element={<Search />} path="search" />
            <Route element={<Groups />} path="groups" />
            <Route element={<Bookmarks />} path="bookmarks" />
            <Route element={<Notification />} path="notifications" />
            <Route element={<ViewAccount />} path="account/:address" />
            <Route element={<ViewAccount />} path="u/:username" />
            <Route path="g/:address">
              <Route element={<ViewGroup />} index />
              <Route path="settings">
                <Route element={<GroupSettings />} index />
                <Route
                  element={<GroupPersonalizeSettings />}
                  path="personalize"
                />
                <Route element={<GroupMonetizeSettings />} path="monetize" />
                <Route element={<RulesSettings />} path="rules" />
              </Route>
            </Route>
            <Route path="posts/:slug">
              <Route element={<ViewPost />} index />
              <Route element={<ViewPost />} path="quotes" />
            </Route>
            <Route path="settings">
              <Route element={<AccountSettings />} index />
              <Route
                element={<AccountPersonalizeSettings />}
                path="personalize"
              />
              <Route element={<AccountMonetizeSettings />} path="monetize" />
              <Route element={<RewardsSettings />} path="rewards" />
              <Route element={<BlockedSettings />} path="blocked" />
              <Route element={<DeveloperSettings />} path="developer" />
              <Route element={<ManagerSettings />} path="manager" />
              <Route element={<SessionsSettings />} path="sessions" />
              <Route element={<UsernameSettings />} path="username" />
            </Route>
            <Route element={<Support />} path="support" />
            <Route element={<Terms />} path="terms" />
            <Route element={<Privacy />} path="privacy" />
            <Route element={<Guidelines />} path="guidelines" />
            <Route element={<Copyright />} path="copyright" />
            <Route element={<Custom404 />} path="*" />
          </Route>
        </RouterRoutes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
