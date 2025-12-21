import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/Shared/UI";
import { ERRORS } from "@/data/errors";
import getAccount from "@/helpers//getAccount";
import errorToast from "@/helpers/errorToast";
import { useMuteMutation, useUnmuteMutation } from "@/indexer/generated";
import { useMuteAlertStore } from "@/store/non-persisted/alert/useMuteAlertStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { ApolloClientError } from "@/types/errors";

const MuteOrUnmuteAccount = () => {
  const { currentAccount } = useAccountStore();
  const {
    mutingOrUnmutingAccount,
    setShowMuteOrUnmuteAlert,
    showMuteOrUnmuteAlert
  } = useMuteAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMuted, setHasMuted] = useState(
    mutingOrUnmutingAccount?.operations?.isMutedByMe
  );
  const { cache } = useApolloClient();

  const updateCache = () => {
    if (!mutingOrUnmutingAccount?.operations) {
      return;
    }

    cache.modify({
      fields: { isMutedByMe: () => !hasMuted },
      id: cache.identify(mutingOrUnmutingAccount?.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setHasMuted(!hasMuted);
    setShowMuteOrUnmuteAlert(false);
    toast.success(hasMuted ? "Unmuted successfully" : "Muted successfully");
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [mute] = useMuteMutation({
    onCompleted,
    onError
  });

  const [unmute] = useUnmuteMutation({
    onCompleted,
    onError
  });

  const muteOrUnmute = async () => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);

    // Unmute
    if (hasMuted) {
      return await unmute({
        variables: {
          request: { account: mutingOrUnmutingAccount?.address }
        }
      });
    }

    // Mute
    return await mute({
      variables: {
        request: { account: mutingOrUnmutingAccount?.address }
      }
    });
  };

  return (
    <Alert
      confirmText={hasMuted ? "Unmute" : "Mute"}
      description={`Are you sure you want to ${
        hasMuted ? "unmute" : "mute"
      } ${getAccount(mutingOrUnmutingAccount).username}?`}
      isPerformingAction={isSubmitting}
      onClose={() => setShowMuteOrUnmuteAlert(false)}
      onConfirm={muteOrUnmute}
      show={showMuteOrUnmuteAlert}
      title="Mute Account"
    />
  );
};

export default MuteOrUnmuteAccount;
