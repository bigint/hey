import GroupMentionPicker from "@/components/Composer/Editor/GroupMentionPicker";
import AccountMentionPicker from "./AccountMentionPicker";
import EmojiPicker from "./EmojiPicker";
import InlineMenu from "./InlineMenu";

const EditorMenus = () => {
  return (
    <>
      <InlineMenu />
      <AccountMentionPicker />
      <GroupMentionPicker />
      <EmojiPicker />
    </>
  );
};

export default EditorMenus;
