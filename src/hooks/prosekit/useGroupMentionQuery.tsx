import { useEffect, useState } from "react";
import { GroupsOrderBy, useGroupsLazyQuery } from "@/indexer/generated";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionGroup = {
  address: string;
  name: string | undefined;
  icon: string | undefined;
  member: boolean;
};

const useGroupMentionQuery = (query: string): MentionGroup[] => {
  const [results, setResults] = useState<MentionGroup[]>([]);
  const [searchGroups] = useGroupsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchGroups({
      variables: {
        request: {
          filter: { searchQuery: query },
          orderBy: GroupsOrderBy.Alphabetical
        }
      }
    }).then(({ data }) => {
      const search = data?.groups;
      const groupsSearchResult = search;
      const groups = groupsSearchResult?.items;
      const groupsResults = (groups ?? []).map(
        (group): MentionGroup => ({
          address: group.address,
          icon: group.metadata?.icon,
          member: group.operations?.isMember ?? false,
          name: group.metadata?.name
        })
      );

      setResults(groupsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
  }, [query, searchGroups]);

  return results;
};

export default useGroupMentionQuery;
