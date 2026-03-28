import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import { isEmail } from 'class-validator';
import { type EnvConfig } from '#/shared/configs';
import { SendEmailDto } from '../dtos/send-email.dto';

export type SendEmailResult =
  | { success: true }
  | { success: false; message: string };

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    const host = configService.get('MAIL_SMTP_HOST', { infer: true });
    const port = configService.get('MAIL_SMTP_PORT', { infer: true });
    const user = configService.get('MAIL_SMTP_USER', { infer: true });
    const pass = configService.get('MAIL_SMTP_PASS', { infer: true });
    this.fromAddress = configService.get('MAIL_FROM', { infer: true });

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendEmail(dto: SendEmailDto): Promise<SendEmailResult> {
    try {
      if (typeof dto.email !== 'string' || !isEmail(dto.email)) {
        return { success: false, message: 'Invalid email address' };
      }
      if (typeof dto.html !== 'string' || dto.html.trim().length === 0) {
        return { success: false, message: 'Email content is required' };
      }
      if (dto.html.length > 10000) {
        return { success: false, message: 'Email content is too large' };
      }

      await this.transporter.sendMail({
        from: this.fromAddress,
        to: dto.email,
        subject: dto.subject ?? 'Notification',
        html: dto.html,
      });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email error';
      return { success: false, message };
    }
  }
}
