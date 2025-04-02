import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @Column({ primary: true, name: 'cart_id' })
  cartId: string;

  @Column({ primary: true, name: 'product_id' })
  productId: string;

  @Column()
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  // We'll need to get product data from elsewhere since we don't have a products table
  product?: any; // This will be populated from an external service
}