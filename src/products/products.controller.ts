import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config/services';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.client.send({ cmd: 'create_product' }, createProductDto )
      .pipe(
        catchError( error => { throw new RpcException( error) })
      );  
  }

  @Get()
  findAllProducts(
    @Query() paginationDto: PaginationDto    
  ) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {

    return this.client.send({ cmd: 'find_one_product' }, {id})
      .pipe(
        catchError( error => { throw new RpcException( error) })
      );    
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string ) {
    return this.client.send({ cmd: 'delete_product' }, {id})
      .pipe(
        catchError( error => { throw new RpcException( error) })
      );
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send({ cmd: 'update_product' }, { id, ...updateProductDto})
      .pipe(
        catchError( error => { throw new RpcException( error) })
      );
  }

}
