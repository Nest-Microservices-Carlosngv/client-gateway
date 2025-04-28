import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { OrderStatus, OrderStatusList } from 'src/orders/enum/order.enum';

export class OrderPaginationDto extends PaginationDto {

  @IsOptional()
  @IsEnum( OrderStatusList, {
    message: `Order status are ${OrderStatusList}`,
  })
  status?: OrderStatus;

}