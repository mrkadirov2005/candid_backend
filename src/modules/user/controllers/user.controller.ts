import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SetActiveDto } from '../dtos/set-active.dto';
import { UserService } from '../services/user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add_user')
  addUser(@Body() dto: CreateUserDto) {
    return this.userService.addUser(dto);
  }

  @Get('verify')
  verify(@Query('userId') userId: string) {
    return this.userService.verify(userId);
  }

  @Post('refresh_token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.userService.refreshToken(dto);
  }

  @Post('activate')
  activate(@Body() dto: SetActiveDto) {
    return this.userService.activate(dto.userId);
  }

  @Post('deactivate')
  deactivate(@Body() dto: SetActiveDto) {
    return this.userService.deactivate(dto.userId);
  }
}
