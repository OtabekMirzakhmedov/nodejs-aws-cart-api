import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartStatus } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { PutCartPayload } from 'src/order/type';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    return this.cartsRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items']
    });
  }

  async createByUserId(userId: string): Promise<Cart> {
    const timestamp = new Date();

    const newCart = this.cartsRepository.create({
      id: randomUUID(), // Explicitly set UUID here
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: CartStatus.OPEN,
      items: []
    });

    return this.cartsRepository.save(newCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload): Promise<Cart> {
    let userCart = await this.findOrCreateByUserId(userId);

    // We'll need to fetch the current items to check if the product already exists
    const itemIndex = userCart.items.findIndex(
      (item) => item.productId === payload.product.id
    );

    if (itemIndex === -1 && payload.count > 0) {
      // Product not in cart, add it
      const newItem = this.cartItemsRepository.create({
        cartId: userCart.id,
        productId: payload.product.id,
        count: payload.count,
      });
      await this.cartItemsRepository.save(newItem);

      // Add the product info to the item for response
      newItem.product = payload.product;
      userCart.items.push(newItem);
    } else if (itemIndex !== -1 && payload.count === 0) {
      // Remove the item
      await this.cartItemsRepository.delete({
        cartId: userCart.id,
        productId: payload.product.id
      });
      userCart.items.splice(itemIndex, 1);
    } else if (itemIndex !== -1) {
      // Update the item count
      await this.cartItemsRepository.update(
        { cartId: userCart.id, productId: payload.product.id },
        { count: payload.count }
      );
      userCart.items[itemIndex].count = payload.count;
    }

    // Update the cart's updated_at timestamp
    userCart.updatedAt = new Date();
    await this.cartsRepository.update(userCart.id, { updatedAt: userCart.updatedAt });

    return userCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      await this.cartItemsRepository.delete({ cartId: cart.id });
      await this.cartsRepository.delete(cart.id);
    }
  }
}