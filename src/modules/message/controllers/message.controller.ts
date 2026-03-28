import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { SetMessageDeletedDto } from '../dtos/set-message-deleted.dto';
import { SetMessageEmailedDto } from '../dtos/set-message-emailed.dto';
import { SetMessageStatusDto } from '../dtos/set-message-status.dto';
import { MessageService } from '../services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
  listAll() {
    return this.messageService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.messageService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.messageService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Post('set_status')
  setStatus(@Body() dto: SetMessageStatusDto) {
    return this.messageService.setStatus(dto);
  }

  @Post('set_deleted')
  setDeleted(@Body() dto: SetMessageDeletedDto) {
    return this.messageService.setDeleted(dto);
  }

  @Post('set_emailed')
  setEmailed(@Body() dto: SetMessageEmailedDto) {
    return this.messageService.setEmailed(dto);
  }
}
