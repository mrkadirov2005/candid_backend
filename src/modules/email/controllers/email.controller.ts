import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from '../dtos/send-email.dto';
import { EmailService } from '../services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  send(@Body() dto: SendEmailDto) {
    return this.emailService.sendEmail(dto);
  }
}
