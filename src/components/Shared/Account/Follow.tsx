import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";
import { Button } from "@/components/Shared/UI";
import { ERRORS } from "@/data/errors";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { type AccountFragment, useFollowMutation } from "@/indexer/generated";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { ApolloClientError } from "@/types/errors";

interface FollowProps {
  onFollow?: () => void;
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
  title?: string;
}

const Follow = ({
  onFollow,
  buttonClassName,
  account,
  small,
  title = "Follow"
}: FollowProps) => {
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
      fields: { isFollowedByMe: () => true },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    onFollow?.();
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [follow] = useFollowMutation({
    onCompleted: async ({ follow }) => {
      if (follow.__typename === "FollowResponse") {
        return onCompleted();
      }

      if (follow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({
          message: follow.reason,
          name: ERRORS.SomethingWentWrong
        });
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: follow
      });
    },
    onError
  });

  const handleCreateFollow = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
    }

    setIsSubmitting(true);

    return await follow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
