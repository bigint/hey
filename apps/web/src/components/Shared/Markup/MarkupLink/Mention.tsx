import type { PostMentionFragment } from "@hey/indexer";
import type { MarkupLinkProps } from "@hey/types/misc";
import { Link } from "react-router";
import AccountPreview from "@/components/Shared/Account/AccountPreview";
import Slug from "@/components/Shared/Slug";
import stopEventPropagation from "@/helpers/stopEventPropagation";

const Mention = ({ mentions, title }: MarkupLinkProps) => {
  if (!title) {
    return null;
  }

  const mention: PostMentionFragment | undefined = mentions?.find(
    (m) => m.replace.from === title
  );

  if (!mention) {
    return title;
  }

  const name =
    mention?.__typename === "GroupMention"
      ? mention.replace.to
      : mention?.replace.from.split("/")[1] || "";

  if (mention?.__typename === "AccountMention") {
    return (
      <Link
        className="outline-hidden focus:underline"
        onClick={stopEventPropagation}
        to={`/u/${name}`}
      >
        <AccountPreview address={mention.account} username={name}>
          <Slug prefix="@" slug={name} useBrandColor />
        </AccountPreview>
      </Link>
    );
  }

  return (
    <Link
      className="outline-hidden focus:underline"
      onClick={stopEventPropagation}
      to={`/g/${mention.replace.from.slice(1)}`}
    >
      <Slug slug={name} useBrandColor />
    </Link>
  );
};

export default Mention;
