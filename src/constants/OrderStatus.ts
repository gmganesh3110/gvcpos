export const OrderStatus = {
  ORDERED: "ORDERED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  DELIVERED: "DELIVERED",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  AVAILABLE: "AVAILABLE",


} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
