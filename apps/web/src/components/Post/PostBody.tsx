import { EyeIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import { type AnyPostFragment, ContentWarning } from "@hey/indexer";
import { getSrc } from "@livepeer/react/external";
import { memo, useState } from "react";
import Quote from "@/components/Shared/Embed/Quote";
import Markup from "@/components/Shared/Markup";
import Attachments from "@/components/Shared/Post/Attachments";
import PostLink from "@/components/Shared/Post/PostLink";
import Video from "@/components/Shared/Post/Video";
import { Button, H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";

interface PostBodyProps {
  contentClassName?: string;
  post: AnyPostFragment;
  quoted?: boolean;
  showMore?: boolean;
}

const PostBody = ({
  contentClassName = "",
  post,
  showMore = false
}: PostBodyProps) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const { metadata } = targetPost;

  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAttachments = getPostData(metadata)?.attachments || [];
  const filteredAsset = getPostData(metadata)?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;

  let content = filteredContent;

  if (canShowMore) {
    const lines = content?.split("\n");
    if (lines && lines.length > 0) {
      content = lines.slice(0, 5).join("\n");
    }
  }

  // Show live if it's there
  const showLive = metadata.__typename === "LivestreamMetadata";
  // Show attachments if they're there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;

  const [showCensored, setShowCensored] = useState(false);
  const contentWarning =
    "contentWarning" in metadata ? metadata.contentWarning : undefined;
  const contentWarningText =
    contentWarning === ContentWarning.Spoiler
      ? "spoiler"
      : contentWarning === ContentWarning.Nsfw
        ? "NSFW content"
        : contentWarning === ContentWarning.Sensitive
          ? "sensitive content"
          : "content";

  return (
    <div className="relative">
      {contentWarning && !showCensored && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              setShowCensored(true);
            }}
            size="sm"
          >
            Show {contentWarningText}
          </Button>
        </div>
      )}
      <div
        className={cn("break-words", {
          "opacity-50 blur-2xl": contentWarning && !showCensored
        })}
      >
        <Markup
          className={cn(
            { "line-clamp-5": canShowMore },
            "markup linkify break-words",
            contentClassName
          )}
          mentions={targetPost.mentions}
        >
          {content}
        </Markup>
        {canShowMore ? (
          <H6 className="mt-4 flex items-center space-x-1 text-gray-500 dark:text-gray-200">
            <EyeIcon className="size-4" />
            <PostLink post={post}>Show more</PostLink>
          </H6>
        ) : null}
        {/* Attachments and Quotes */}
        {showAttachments ? (
          <Attachments
            asset={filteredAsset}
            attachments={filteredAttachments}
          />
        ) : null}
        {showLive ? (
          <div className="mt-3">
            <Video src={getSrc(metadata.liveUrl || metadata.playbackUrl)} />
          </div>
        ) : null}
        {targetPost.quoteOf ? <Quote post={targetPost.quoteOf} /> : null}
      </div>
    </div>
  );
};

export default memo(PostBody);
