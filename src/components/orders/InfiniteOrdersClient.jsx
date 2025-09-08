// app/orders/InfiniteOrdersClient.jsx
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiJSON } from "@/lib/api";
import { qk } from "@/lib/query-keys";

const ordersInfiniteOptions = () => ({
  queryKey: [...qk.orders.list({ infinite: true })],
  queryFn: ({ pageParam, signal }) => apiJSON(`/orders?cursor=${pageParam ?? ""}`, { signal }),
  initialPageParam: null,
  getNextPageParam: (last) => last?.nextCursor ?? null,
  staleTime: 30_000,
});

export default function InfiniteOrdersClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(ordersInfiniteOptions());
  return (
    <div>
      {(data?.pages ?? []).map((p, i) => <pre key={i}>{JSON.stringify(p.items, null, 2)}</pre>)}
      <button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? "Loading…" : hasNextPage ? "Load more" : "No more"}
      </button>
    </div>
  );
}