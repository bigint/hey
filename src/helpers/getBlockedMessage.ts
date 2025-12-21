import getAccount from "@/helpers//getAccount";
import type { AccountFragment } from "@/indexer/generated";

const formatMessage = (
  account: AccountFragment,
  formatter: (username: string) => string
): string => {
  const { username } = getAccount(account);

  return formatter(username);
};

export const getBlockedByMeMessage = (account: AccountFragment): string =>
  formatMessage(account, (username) => `You have blocked ${username}`);

export const getBlockedMeMessage = (account: AccountFragment): string =>
  formatMessage(account, (username) => `${username} has blocked you`);
