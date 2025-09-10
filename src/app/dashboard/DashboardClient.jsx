// app/(dashboard)/DashboardClient.jsx
"use client";

import { Suspense } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { ordersListOptions } from "@/lib/queries/orders";
import {
  analyticsSummaryOptions,
  slowReportOptions,
} from "@/lib/queries/analytics";
import { Button } from "@/components/ui/button";
import { qk } from "@/lib/query-keys";

// function OrdersCard() {
//   const { data } = useSuspenseQuery(ordersListOptions({ limit: 5 }));
//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// }

function SummaryCard() {
  const { data } = useSuspenseQuery(analyticsSummaryOptions());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function SlowReportCard() {
  const { data } = useSuspenseQuery(slowReportOptions()); // streams in when ready
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function DashboardClient() {
  const queryClient = useQueryClient();
  return (
    <>
      <h1>Dashboard</h1>
      <div className="flex space-x-2">
        <Button
          onClick={() =>
            queryClient.refetchQueries({
              queryKey: qk.analytics.summary(),
            })
          }
        >
          Refetch Summary
        </Button>
        <Button
          onClick={() =>
            queryClient.refetchQueries({
              queryKey: qk.analytics.slowReport(),
            })
          }
        >
          Refetch Report
        </Button>
      </div>
      {/* <Suspense fallback={<p>Loading orders…</p>}>
        <OrdersCard />
      </Suspense> */}
      <Suspense fallback={<p>Loading summary…</p>}>
        <SummaryCard />
      </Suspense>
      <Suspense fallback={<p>Crunching slow report…</p>}>
        <SlowReportCard />
      </Suspense>
    </>
  );
}
