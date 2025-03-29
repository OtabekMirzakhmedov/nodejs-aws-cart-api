// src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItem } from './entities/cart-item.entity';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItem[]> {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items;
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PutCartPayload,
  ): Promise<CartItem[]> {
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      throw new BadRequestException('Cart is empty');
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(items);
    const order = await this.orderService.create({
      userId,
      cartId,
      items: items.map(({ productId, count }) => ({
        productId,
        count,
      })),
      address: body.address,
      total,
    });
    await this.cartService.removeByUserId(userId);

    return {
      order,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<Order[]> {
    return this.orderService.getAll();
  }
}

@Controller('api/admin/carts')
export class CartAdminController {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  //@UseGuards(BasicAuthGuard)
  @Get()
  async getAllCarts() {
    console.log('Admin carts endpoint hit');
    try {
      const carts = await this.cartsRepository.find({
        relations: ['items']
      });

      console.log('Found carts:', carts);

      // You might want to also get cart items
      const cartItems = await this.cartItemsRepository.find();

      console.log('Found cart items:', cartItems);

      return {
        carts,
        cartItems
      };
    } catch (error) {
      console.error('Error in getAllCarts:', error);
      throw error; // Let NestJS handle the error
    }
  }
}