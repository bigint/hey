import { useState } from "react";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import ContentFeedType from "@/components/Shared/Post/ContentFeedType";
import type { MainContentFocus } from "@/indexer/generated";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import BookmarksFeed from "./BookmarksFeed";

const Bookmarks = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Bookmarks">
      <ContentFeedType
        focus={focus}
        layoutId="bookmarks_tab"
        setFocus={setFocus}
      />
      <BookmarksFeed focus={focus} />
    </PageLayout>
  );
};

export default Bookmarks;
