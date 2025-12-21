import { zeroAddress } from "viem";
import type { AccountFragment } from "@/indexer/generated";

const isAccountDeleted = (account: AccountFragment): boolean =>
  account.owner === zeroAddress;

export default isAccountDeleted;
