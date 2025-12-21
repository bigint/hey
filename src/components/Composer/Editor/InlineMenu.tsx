import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon
} from "@heroicons/react/24/outline";
import { useEditor } from "prosekit/react";
import { InlinePopover } from "prosekit/react/inline-popover";
import type { EditorExtension } from "@/helpers/prosekit/extension";
import Toggle from "./Toggle";

const InlineMenu = () => {
  const editor = useEditor<EditorExtension>({ update: true });

  return (
    <InlinePopover className="z-10 flex space-x-1 rounded-xl border border-gray-200 bg-white p-1 shadow-xs dark:border-gray-700 dark:bg-gray-900">
      <Toggle
        disabled={!editor.commands.toggleBold.canExec()}
        onClick={() => editor.commands.toggleBold()}
        pressed={editor.marks.bold.isActive()}
        tooltip="Bold"
      >
        <BoldIcon className="size-4" />
      </Toggle>
      <Toggle
        disabled={!editor.commands.toggleItalic.canExec()}
        onClick={() => editor.commands.toggleItalic()}
        pressed={editor.marks.italic.isActive()}
        tooltip="Italic"
      >
        <ItalicIcon className="size-4" />
      </Toggle>
      <Toggle
        disabled={!editor.commands.toggleStrike.canExec()}
        onClick={() => editor.commands.toggleStrike()}
        pressed={editor.marks.strike.isActive()}
        tooltip="Strike"
      >
        <StrikethroughIcon className="size-4" />
      </Toggle>
    </InlinePopover>
  );
};

export default InlineMenu;
