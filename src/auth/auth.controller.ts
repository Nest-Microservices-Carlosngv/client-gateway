import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { User } from './decorators';
import { Token } from './decorators/token.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post('register')
  registerUser( @Body() registerUserDto: RegisterUserDto ) {
    return this.client.send('auth.register.user', registerUserDto )
      .pipe( catchError( error => { throw new RpcException( error ) } ));
  }

  @Post('login')
  loginUser( @Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto )
      .pipe( catchError( error => { throw new RpcException( error ) } ));
  }

  
  @UseGuards( AuthGuard )
  @Get('verify')
  verifyToken(@User() user: any, @Token() token: string ) {
    
    return { user, token }

    // return this.client.send('auth.verify.token', {ABC: 123})
    //   .pipe( catchError( error => { throw new RpcException( error ) } ));
  }

}
