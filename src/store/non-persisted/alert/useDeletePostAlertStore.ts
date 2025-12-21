import type { PostFragment } from "@/indexer/generated";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  deletingPost?: PostFragment;
  showPostDeleteAlert: boolean;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost?: PostFragment
  ) => void;
}

const { useStore: useDeletePostAlertStore } = createTrackedStore<State>(
  (set) => ({
    deletingPost: undefined,
    setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
      set(() => ({ deletingPost, showPostDeleteAlert })),
    showPostDeleteAlert: false
  })
);

export { useDeletePostAlertStore };
