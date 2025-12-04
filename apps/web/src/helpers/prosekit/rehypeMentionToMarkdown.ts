import { Root } from "hast";

/**
 * Rehype plugin to convert group mention elements to evm addresses.
 *
 * eg: #devs -> #0x21F278F492416652d7Bf9871c280C19A209337f5
 */
export function rehypeMentionToMarkdown() {
  return (tree: Root) => {
    const visit = (node: any) => {
      if (
        node.type === "element" &&
        node.tagName === "span" &&
        node.properties
      ) {
        if (node.properties.dataMention === "group" && node.properties.dataId) {
          const dataId = String(node.properties.dataId);
          node.children = [{ type: "text", value: `#${dataId}` }];
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}
