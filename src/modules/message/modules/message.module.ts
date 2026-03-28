import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MessageController } from '../controllers/message.controller';
import { MessageRepository } from '../repositories/message.repository';
import { MessageService } from '../services/message.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [MessageRepository, MessageService],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
