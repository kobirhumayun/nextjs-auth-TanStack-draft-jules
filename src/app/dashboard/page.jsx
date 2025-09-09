// app/(dashboard)/page.jsx
import { dehydrate } from "@tanstack/react-query";
import HydrateClient from "@/components/HydrateClient";
import DashboardClient from "./DashboardClient";
import { ordersListOptions } from "@/lib/queries/orders";
import { analyticsSummaryOptions, slowReportOptions } from "@/lib/queries/analytics";
import { getQueryClient } from "@/app/get-query-client";
import { auth } from "@/auth";        // optional gate
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const qc = getQueryClient();

  // Await "must-have" queries for immediate content
  await qc.prefetchQuery(ordersListOptions({ limit: 5 }));
  await qc.prefetchQuery(analyticsSummaryOptions());

  // Kick off a slow query but DON'T await → dehydrated as "pending"
  qc.prefetchQuery(slowReportOptions());

  return (
    <HydrateClient state={dehydrate(qc)}>
      <DashboardClient />
    </HydrateClient>
  );
}