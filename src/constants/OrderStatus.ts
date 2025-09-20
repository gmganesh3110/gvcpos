export const OrderStatus = {
  COMPLETED: "COMPLETED",
  AVAILABLE: "AVAILABLE",
  INPROGRESS: "INPROGRESS",
  BILLED: "BILLED",
  ORDERED: "ORDERED",
  SERVED: "SERVED",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
