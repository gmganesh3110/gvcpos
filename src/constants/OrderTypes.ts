export const OrderType = {
  DINEIN: "DINEIN",
  TAKEAWAY: "TAKEAWAY",
  DELIVERY: "DELIVERY",
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];
