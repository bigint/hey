import { memo } from "react";
import { Button, Card } from "@/components/Shared/UI";

interface PostWarningProps {
  message: string;
  setIgnoreBlock: (ignore: boolean) => void;
}

const PostWarning = ({ message, setIgnoreBlock }: PostWarningProps) => {
  return (
    <Card
      className="!bg-gray-100 dark:!bg-gray-800 m-5 flex items-center justify-between px-4"
      forceRounded
    >
      <div className="py-3 text-sm">{message}</div>
      <Button onClick={() => setIgnoreBlock(true)} outline size="sm">
        Show post
      </Button>
    </Card>
  );
};

export default memo(PostWarning);
