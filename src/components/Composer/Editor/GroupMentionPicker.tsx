import { UserGroupIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useEditor } from "prosekit/react";
import {
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover
} from "prosekit/react/autocomplete";
import { useState } from "react";
import { Image } from "@/components/Shared/UI";
import { EditorRegex } from "@/data/regex";
import sanitizeDStorageUrl from "@/helpers//sanitizeDStorageUrl";
import cn from "@/helpers/cn";
import type { EditorExtension } from "@/helpers/prosekit/extension";
import type { MentionGroup } from "@/hooks/prosekit/useGroupMentionQuery";
import useGroupMentionQuery from "@/hooks/prosekit/useGroupMentionQuery";

interface MentionGroupItemProps {
  onSelect: VoidFunction;
  group: MentionGroup;
}

const MentionGroupItem = ({ onSelect, group }: MentionGroupItemProps) => {
  return (
    <div className="m-0 p-0">
      <AutocompleteItem
        className="focusable-dropdown-item m-1.5 flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-1 dark:text-white"
        onSelect={onSelect}
        value={group.address}
      >
        {group.icon ? (
          <Image
            alt={group.name}
            className="aspect-square size-7 rounded-full border border-gray-200 bg-gray-200 object-cover dark:border-gray-700"
            height="28"
            src={sanitizeDStorageUrl(group.icon)}
            width="28"
          />
        ) : (
          <div className="flex aspect-square h-7 items-center justify-center rounded-full border border-gray-200 bg-gray-300 text-gray-700 dark:border-gray-700">
            <UserGroupIcon className="size-5" />
          </div>
        )}
        <div className="flex w-full flex-col truncate">
          <div className="flex items-center justify-between gap-1">
            <div>{group.name || "Unnamed Group"}</div>
            {group.member && <UsersIcon className="size-4 text-gray-500" />}
          </div>
        </div>
      </AutocompleteItem>
    </div>
  );
};

const GroupMentionPicker = () => {
  const editor = useEditor<EditorExtension>();
  const [queryString, setQueryString] = useState<string>("");
  const results = useGroupMentionQuery(queryString);

  const handleGroupInsert = (group: MentionGroup) => {
    editor.commands.insertMention({
      id: group.address,
      kind: "group",
      value: group.name || group.address
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      className={cn(
        "z-10 block w-52 rounded-xl border border-gray-200 bg-white p-0 shadow-xs dark:border-gray-700 dark:bg-gray-900",
        !results.length && "hidden"
      )}
      offset={10}
      onQueryChange={setQueryString}
      regex={EditorRegex.groupMention}
    >
      <AutocompleteList
        className="divide-y divide-gray-200 dark:divide-gray-700"
        filter={null}
      >
        {results.map((group) => (
          <MentionGroupItem
            group={group}
            key={group.address}
            onSelect={() => handleGroupInsert(group)}
          />
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
};

export default GroupMentionPicker;
