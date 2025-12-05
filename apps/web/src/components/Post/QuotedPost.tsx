import type { PostFragment } from "@hey/indexer";
import { memo, useState } from "react";
import PostWarning from "@/components/Shared/Post/PostWarning";
import PostWrapper from "@/components/Shared/Post/PostWrapper";
import { getBlockedByMeMessage } from "@/helpers/getBlockedMessage";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface QuotedPostProps {
  isNew?: boolean;
  post: PostFragment;
}

const QuotedPost = ({ isNew = false, post }: QuotedPostProps) => {
  const isBlockedByMe = post.author.operations?.isBlockedByMe;

  const [ignoreBlock, setIgnoreBlock] = useState(false);

  if (isBlockedByMe && !ignoreBlock) {
    return (
      <PostWarning
        message={getBlockedByMeMessage(post.author)}
        setIgnoreBlock={setIgnoreBlock}
      />
    );
  }

  return (
    <PostWrapper
      className="cursor-pointer p-4 first:rounded-t-xl last:rounded-b-xl"
      post={post}
    >
      <div className="flex items-center gap-x-2">
        <PostAvatar post={post} quoted />
        <PostHeader isNew={isNew} post={post} quoted />
      </div>
      {post.isDeleted ? (
        <HiddenPost type={post.__typename} />
      ) : (
        <PostBody post={post} showMore />
      )}
    </PostWrapper>
  );
};

export default memo(QuotedPost);
