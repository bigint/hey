import QuotedPost from "@/components/Post/QuotedPost";
import type { PostFragment } from "@/indexer/generated";
import Wrapper from "./Wrapper";

interface QuoteProps {
  post: PostFragment;
}

const Quote = ({ post }: QuoteProps) => {
  if (!post) {
    return null;
  }

  return (
    <Wrapper zeroPadding>
      <QuotedPost post={post} />
    </Wrapper>
  );
};

export default Quote;
