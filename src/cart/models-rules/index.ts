import { CartItem } from '../entities/cart-item.entity';

export function calculateCartTotal(items: CartItem[]): number {
  return items.length
    ? items.reduce((acc: number, item: CartItem) => {
        return (acc += (item.product?.price || 0) * item.count);
      }, 0)
    : 0;
}