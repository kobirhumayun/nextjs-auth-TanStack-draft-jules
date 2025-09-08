// lib/query-keys.js
export const qk = {
  orders: {
    list: (params) => ["orders", "list", params || {}],
    byId: (id) => ["orders", "byId", String(id)],
  },
  analytics: {
    summary: () => ["analytics", "summary"],
    slowReport: () => ["analytics", "slow-report"],
  },
};