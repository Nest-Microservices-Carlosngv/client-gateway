import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE, ORDERS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto } from 'src/common/dto/order.pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) 
    private readonly client: ClientProxy
  ){}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
      .pipe(
        catchError( error => { throw new RpcException( error ) } )
      );
  }

  @Get()
  findAll(
    @Query() orderPaginationDto: OrderPaginationDto
  ) {
    // return orderPaginationDto;
    return this.client.send('findAllOrders', orderPaginationDto)
      .pipe(
        catchError( error => { throw new RpcException( error ) } )
      );
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    
    return this.client.send('findOneOrder', { id })
      .pipe(
        catchError( error => { throw new RpcException( error ) } )
      );
  }
    
    @Patch(':id')
    changeStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() statusDto: StatusDto
    ) {
      return this.client.send('changeOrderStatus', { id, ...statusDto })
        .pipe(
          catchError( error => { throw new RpcException( error ) } )
        );
      
  }

}
