import { Localstorage } from "@/data/storage";
import type { AccountFragment } from "@/indexer/generated";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface State {
  currentAccount?: AccountFragment;
  setCurrentAccount: (currentAccount?: AccountFragment) => void;
}

const { useStore: useAccountStore } = createPersistedTrackedStore<State>(
  (set, _get) => ({
    currentAccount: undefined,
    setCurrentAccount: (currentAccount?: AccountFragment) =>
      set(() => ({ currentAccount }))
  }),
  { name: Localstorage.AccountStore }
);

export { useAccountStore };
