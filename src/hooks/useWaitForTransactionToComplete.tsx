import { useCallback } from "react";
import { useTransactionStatusLazyQuery } from "@/indexer/generated";

const INITIAL_DELAY = 1000;
const MAX_DELAY = 10000;
const MAX_TIMEOUT = 60000;

class TransactionWaitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionWaitError";
  }
}

const useWaitForTransactionToComplete = () => {
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });

  const waitForTransactionToComplete = useCallback(
    async (hash: string, timeout = MAX_TIMEOUT) => {
      let delay = INITIAL_DELAY;
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const { data } = await getTransactionStatus({
          variables: { request: { txHash: hash } }
        });

        const status = data?.transactionStatus;

        if (status?.__typename === "FinishedTransactionStatus") {
          return;
        }

        if (status?.__typename === "FailedTransactionStatus") {
          throw new TransactionWaitError(status.reason);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, MAX_DELAY);
      }

      throw new TransactionWaitError("Transaction confirmation timed out");
    },
    [getTransactionStatus]
  );

  return waitForTransactionToComplete;
};

export default useWaitForTransactionToComplete;
