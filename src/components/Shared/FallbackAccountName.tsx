import type { ReactNode } from "react";
import { memo } from "react";
import AccountLink from "@/components/Shared/Account/AccountLink";
import getAccount from "@/helpers//getAccount";
import cn from "@/helpers/cn";
import type { AccountFragment } from "@/indexer/generated";
import Slug from "./Slug";

interface FallbackAccountNameProps {
  className?: string;
  account?: AccountFragment;
  separator?: ReactNode;
}

const FallbackAccountName = ({
  className = "",
  account,
  separator = ""
}: FallbackAccountNameProps) => {
  if (!account) {
    return null;
  }

  const { name, username } = getAccount(account);
  const accountName = account?.metadata?.name || <Slug slug={username} />;

  return (
    <>
      <AccountLink
        account={account}
        aria-label={`Account of ${name || username}`}
        className={cn(
          "max-w-sm truncate outline-hidden hover:underline focus:underline",
          className
        )}
      >
        <b className="whitespace-nowrap">{accountName}</b>
      </AccountLink>
      {separator && <span>{separator}</span>}
    </>
  );
};

export default memo(FallbackAccountName);
