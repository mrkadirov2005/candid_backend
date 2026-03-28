import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateStudentDto } from '../../student/dtos/create-student.dto';
import { LoginDto } from '../dtos/login.dto';
import { SendInviteDto } from '../dtos/send-invite.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('send_invite')
  sendInvite(@Query() dto: SendInviteDto) {
    return this.authService.sendInvite(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register/student')
  registerStudent(@Body() dto: CreateStudentDto) {
    return this.authService.registerStudent(dto);
  }
}
