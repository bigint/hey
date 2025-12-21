import type { Root } from "hast";
import { visitParents } from "unist-util-visit-parents";

/**
 * Rehype plugin to convert group mention elements to evm addresses.
 *
 * eg: #devs -> #0x21F278F492416652d7Bf9871c280C19A209337f5
 */
export function rehypeMentionToMarkdown() {
  return (tree: Root) => {
    visitParents(tree, "element", (node: any) => {
      if (
        node.tagName === "span" &&
        node.properties &&
        node.properties.dataMention === "group" &&
        node.properties.dataId
      ) {
        const dataId = String(node.properties.dataId);
        node.children = [{ type: "text", value: `#${dataId}` }];
      }
    });
  };
}
