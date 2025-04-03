import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @Column({ primary: true, name: 'cart_id', type: 'uuid' })
  cartId: string;

  @Column({ primary: true, name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  product?: any;
}
