import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";
import { Button } from "@/components/Shared/UI";
import { ERRORS } from "@/data/errors";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { type AccountFragment, useUnfollowMutation } from "@/indexer/generated";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { ApolloClientError } from "@/types/errors";

interface UnfollowProps {
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
  title: string;
}

const Unfollow = ({
  buttonClassName,
  account,
  small,
  title
}: UnfollowProps) => {
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal } = useAuthModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    if (!account.operations) {
      return;
    }

    cache.modify({
      fields: { isFollowedByMe: () => false },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [unfollow] = useUnfollowMutation({
    onCompleted: async ({ unfollow }) => {
      if (unfollow.__typename === "UnfollowResponse") {
        return onCompleted();
      }

      if (unfollow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({
          message: unfollow.reason,
          name: ERRORS.SomethingWentWrong
        });
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: unfollow
      });
    },
    onError
  });

  const handleCreateUnfollow = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
    }

    setIsSubmitting(true);
    return await unfollow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleCreateUnfollow}
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Unfollow;
