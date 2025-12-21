import Slug from "@/components/Shared/Slug";
import { H3, Image } from "@/components/Shared/UI";
import { STATIC_IMAGES_URL } from "@/data/constants";
import getAccount from "@/helpers//getAccount";
import type { AccountFragment } from "@/indexer/generated";

interface DeletedDetailsProps {
  account: AccountFragment;
}

const DeletedDetails = ({ account }: DeletedDetailsProps) => {
  const { name, username } = getAccount(account);

  return (
    <div className="space-y-5 px-5 md:px-0">
      <div className="relative -mt-14 ml-5 size-20 sm:-mt-24 sm:size-36">
        <Image
          alt={account.address}
          className="size-20 rounded-xl bg-gray-200 ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black"
          height={128}
          src={`${STATIC_IMAGES_URL}/suspended.png`}
          width={128}
        />
      </div>
      <div className="space-y-1 py-2">
        <H3 className="truncate">{name}</H3>
        <div>
          <Slug className="text-sm sm:text-base" slug={username} />
        </div>
      </div>
    </div>
  );
};

export default DeletedDetails;
