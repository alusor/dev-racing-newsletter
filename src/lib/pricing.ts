export const BASE_PRICES = {
  daily: 9.99,
  weekly: 4.99,
} as const;

export function calculatePrice(
  frequency: "daily" | "weekly",
  subscriberCount: number
): { price: number; originalPrice: number; discount: number } {
  const originalPrice = BASE_PRICES[frequency];
  const discountPercent = Math.min(subscriberCount * 0.02, 0.7);
  const price = Math.round(originalPrice * (1 - discountPercent) * 100) / 100;
  return {
    price,
    originalPrice,
    discount: Math.round(discountPercent * 100),
  };
}
