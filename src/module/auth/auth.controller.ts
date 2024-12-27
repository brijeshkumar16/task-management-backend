import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Request } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 201, description: 'Successful' })
  @Public()
  @Post('/login')
  login(@Body() signInAuthDto: SignInAuthDto) {
    return this.authService.login(signInAuthDto);
  }

  @Public()
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 201, description: 'Successful' })
  @Post('/register')
  SignUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.register(signUpAuthDto);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Successful' })
  @Post('/refresh')
  async refresh(@Body() refreshAuthDto: RefreshAuthDto) {
    return this.authService.refreshToken(refreshAuthDto.refreshToken);
  }

  @ApiOperation({ summary: 'Login user details' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBearerAuth()
  @Get('/me')
  async getMe(@Request() req) {
    return this.authService.getMe(req.user.sub);
  }
}
