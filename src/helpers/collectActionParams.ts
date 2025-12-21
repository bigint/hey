import type { PostActionConfigInput } from "@/indexer/generated";
import type { CollectActionType } from "@/types/hey";

const collectActionParams = (
  collectAction: CollectActionType
): PostActionConfigInput | null => {
  const { payToCollect, collectLimit, endsAt } = collectAction;

  return {
    simpleCollect: { collectLimit, endsAt, payToCollect }
  };
};

export default collectActionParams;
