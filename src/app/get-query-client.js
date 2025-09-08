// app/get-query-client.js
import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Good defaults for SSR + SWR
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: (fails, err) => (err?.status === 401 ? false : fails < 2),
        retryDelay: (n) => Math.min(1000 * 2 ** n, 5000),
      },
      // 👇 Include *pending* queries in dehydration so Next can stream them
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        // Let Next.js handle error redaction
        shouldRedactErrors: () => false,
      },
    },
  });
}

let browserQueryClient;
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}