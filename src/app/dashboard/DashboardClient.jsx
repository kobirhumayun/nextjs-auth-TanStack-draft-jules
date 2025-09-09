// app/(dashboard)/DashboardClient.jsx
"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ordersListOptions } from "@/lib/queries/orders";
import { analyticsSummaryOptions, slowReportOptions } from "@/lib/queries/analytics";

function OrdersCard() {
  const { data } = useSuspenseQuery(ordersListOptions({ limit: 5 }));
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function SummaryCard() {
  const { data } = useSuspenseQuery(analyticsSummaryOptions());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function SlowReportCard() {
  const { data } = useSuspenseQuery(slowReportOptions()); // streams in when ready
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function DashboardClient() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading orders…</p>}><OrdersCard /></Suspense>
      <Suspense fallback={<p>Loading summary…</p>}><SummaryCard /></Suspense>
      <Suspense fallback={<p>Crunching slow report…</p>}><SlowReportCard /></Suspense>
    </>
  );
}