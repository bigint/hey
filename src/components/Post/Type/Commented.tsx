import ThreadBody from "@/components/Post/ThreadBody";
import type { PostFragment } from "@/indexer/generated";

interface CommentedProps {
  commentOn: PostFragment;
}

const Commented = ({ commentOn }: CommentedProps) => {
  return <ThreadBody post={commentOn} />;
};

export default Commented;
