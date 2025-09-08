// app/orders/UpdateOrderButton.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { apiJSON } from "@/lib/api";

async function patchOrder({ id, payload, signal }) {
  return apiJSON(`/orders/${id}`, { method: "PATCH", body: payload, signal });
}

export default function UpdateOrderButton({ id }) {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, payload, signal }) => patchOrder({ id, payload, signal }),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: qk.orders.list({ limit: 5 }) });
      const prev = qc.getQueryData(qk.orders.list({ limit: 5 }));
      qc.setQueryData(qk.orders.list({ limit: 5 }), (curr) =>
        curr ? { ...curr, items: curr.items.map((o) => (o.id === id ? { ...o, ...payload } : o)) } : curr
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(qk.orders.list({ limit: 5 }), ctx.prev); },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.orders.list({ limit: 5 }) });
      qc.invalidateQueries({ queryKey: qk.orders.byId(id) });
    },
  });

  return (
    <button disabled={isPending} onClick={() => mutateAsync({ id, payload: { status: "packed" } })}>
      {isPending ? "Saving…" : "Mark packed"}
    </button>
  );
}