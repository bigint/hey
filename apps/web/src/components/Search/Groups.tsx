import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { useCallback } from "react";
import { WindowVirtualizer } from "virtua";
import SingleGroup from "@/components/Shared/Group/SingleGroup";
import SingleGroupShimmer from "@/components/Shared/Shimmer/SingleGroupShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";

interface GroupsProps {
  query: string;
}

const Groups = ({ query }: GroupsProps) => {
  const request: GroupsRequest = {
    filter: { searchQuery: query },
    orderBy: GroupsOrderBy.Alphabetical,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useGroupsQuery({
    skip: !query,
    variables: { request }
  });

  const groups = data?.groups?.items;
  const pageInfo = data?.groups?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <SingleGroupShimmer isBig />;
  }

  if (!groups?.length) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="size-8" />}
        message={
          <span>
            No groups for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load groups" />;
  }

  return (
    <WindowVirtualizer>
      {groups.map((group) => (
        <Card className="mb-5 p-5" key={group.address}>
          <SingleGroup group={group} isBig showDescription />
        </Card>
      ))}
      {hasMore && <span ref={loadMoreRef} />}
    </WindowVirtualizer>
  );
};

export default Groups;
