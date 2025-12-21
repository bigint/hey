import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import linkifyRegex from "remark-linkify-regex";
import stripMarkdown from "strip-markdown";
import type { PluggableList } from "unified";
import { Regex } from "@/data/regex";
import trimify from "@/helpers//trimify";
import type { PostMentionFragment } from "@/indexer/generated";
import MarkupLink from "./MarkupLink";

const plugins: PluggableList = [
  [
    stripMarkdown,
    { keep: ["strong", "emphasis", "list", "listItem", "delete"] }
  ],
  remarkBreaks,
  remarkGfm,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.accountMention),
  linkifyRegex(Regex.groupMention)
];

interface MarkupProps {
  children: string;
  className?: string;
  mentions?: PostMentionFragment[];
}

const Markup = ({ children, className = "", mentions = [] }: MarkupProps) => {
  if (!children) {
    return null;
  }

  const components = {
    a: (props: any) => <MarkupLink mentions={mentions} title={props.title} />
  };

  return (
    <span className={className}>
      <ReactMarkdown components={components} remarkPlugins={plugins}>
        {trimify(children)}
      </ReactMarkdown>
    </span>
  );
};

export default memo(Markup);
