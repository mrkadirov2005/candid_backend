import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { SetMessageDeletedDto } from '../dtos/set-message-deleted.dto';
import { SetMessageEmailedDto } from '../dtos/set-message-emailed.dto';
import { SetMessageStatusDto } from '../dtos/set-message-status.dto';
import { MessageStatus } from '../models/message.model';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async create(dto: CreateMessageDto) {
    return this.messageRepository.create({
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      message: dto.message,
      status: MessageStatus.Sending,
      isDeleted: false,
      isEmailed: false,
    });
  }

  async findById(id: string) {
    return this.messageRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.messageRepository.list(params);
  }

  async listAll() {
    return this.messageRepository.listAll();
  }

  async setStatus(dto: SetMessageStatusDto) {
    const row = await this.messageRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Message not found');
    if (row.isDeleted) throw new BadRequestException('Message is deleted');

    return this.messageRepository.setStatus(dto.id, dto.status);
  }

  async setDeleted(dto: SetMessageDeletedDto) {
    const row = await this.messageRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Message not found');

    return this.messageRepository.setDeleted(dto.id, dto.isDeleted);
  }

  async setEmailed(dto: SetMessageEmailedDto) {
    const row = await this.messageRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Message not found');

    return this.messageRepository.setEmailed(dto.id, dto.isEmailed);
  }
}
