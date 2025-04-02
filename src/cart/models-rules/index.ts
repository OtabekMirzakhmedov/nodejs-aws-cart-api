// src/cart/models-rules/index.ts
import { CartItem } from '../entities/cart-item.entity';

export function calculateCartTotal(items: CartItem[]): number {
  return items.length
    ? items.reduce((acc: number, item: CartItem) => {
      // Since the product is now stored differently, we need to handle it differently
      // Assuming product information is added to the item by the service
      return (acc += (item.product?.price || 0) * item.count);
    }, 0)
    : 0;
}