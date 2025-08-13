export const OrderType = {
  DINE_IN: "DINE_IN",
  TAKE_AWAY: "TAKE_AWAY",
  DELIVERY: "DELIVERY",
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];
