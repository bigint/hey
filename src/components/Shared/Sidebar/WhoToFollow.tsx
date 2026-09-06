import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { memo, useState } from "react";
import Suggested from "@/components/Home/Suggested";
import DismissRecommendedAccount from "@/components/Shared/Account/DismissRecommendedAccount";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import Skeleton from "@/components/Shared/Skeleton";
import { Card, ErrorMessage, Modal } from "@/components/Shared/UI";
import {
  type AccountFragment,
  PageSize,
  useAccountRecommendationsQuery
} from "@/indexer/generated";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const Header = memo(() => (
  <div className="flex items-center justify-between pb-1">
    <div className="flex items-center gap-x-2">
      <SparklesIcon className="size-5 text-brand-500" />
      <h2 className="font-bold text-base">Who to Follow</h2>
    </div>
  </div>
));

const WhoToFollow = () => {
  const { currentAccount } = useAccountStore();
  const [showMore, setShowMore] = useState(false);

  const { data, error, loading } = useAccountRecommendationsQuery({
    variables: {
      request: {
        account: currentAccount?.address,
        pageSize: PageSize.Fifty,
        shuffle: true
      }
    }
  });

  if (loading) {
    return (
      <Card className="space-y-4 p-5">
        <Header />
        {Array.from({ length: 5 }, (_, index) => `placeholder-${index}`).map(
          (id) => (
            <div className="flex items-center gap-x-3" key={id}>
              <div className="w-full">
                <SingleAccountShimmer showFollowUnfollowButton />
              </div>
              <XMarkIcon className="size-4 text-gray-500" />
            </div>
          )
        )}
        <div className="pt-2 pb-1">
          <Skeleton className="h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!data?.mlAccountRecommendations.items.length) {
    return null;
  }

  const recommendedAccounts = data?.mlAccountRecommendations.items.filter(
    (account) =>
      !account.operations?.isBlockedByMe &&
      !account.operations?.isFollowedByMe &&
      !account.operations?.hasBlockedMe
  ) as AccountFragment[];

  if (!recommendedAccounts?.length) {
    return null;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <Header />
        </div>
        <ErrorMessage
          className="mx-5"
          error={error}
          title="Failed to load recommendations"
        />
        <div className="px-2 pb-2">
          {recommendedAccounts?.slice(0, 5).map((account) => (
            <div
              className="flex items-center gap-x-3 truncate rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-700/40"
              key={account?.address}
            >
              <div className="w-full">
                <SingleAccount
                  account={account}
                  hideFollowButton={currentAccount?.address === account.address}
                  hideUnfollowButton={
                    currentAccount?.address === account.address
                  }
                />
              </div>
              <DismissRecommendedAccount account={account} />
            </div>
          ))}
        </div>
        {recommendedAccounts.length > 5 && (
          <button
            className="w-full border-gray-200 border-t px-5 py-3 text-left font-semibold text-brand-500 text-sm transition-colors hover:bg-brand-50/60 dark:border-gray-700 dark:hover:bg-brand-500/10"
            onClick={() => setShowMore(true)}
            type="button"
          >
            Show more
          </button>
        )}
      </Card>
      <Modal
        onClose={() => setShowMore(false)}
        show={showMore}
        title="Suggested for you"
      >
        <Suggested accounts={recommendedAccounts} />
      </Modal>
    </>
  );
};

export default memo(WhoToFollow);
