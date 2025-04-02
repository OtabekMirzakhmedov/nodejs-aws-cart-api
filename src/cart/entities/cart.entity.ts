// src/cart/entities/cart.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: CartStatus,
  })
  status: CartStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}