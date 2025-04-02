import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { CartAdminController, CartController } from './cart.controller';
import { CartService } from './services';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    OrderModule
  ],
  providers: [CartService],
  controllers: [CartController, CartAdminController],
})

export class CartModule {}