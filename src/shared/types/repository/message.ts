import { type MessageStatus } from '#/modules/message/models/message.model';

export type CreateMessageInput = {
  senderId: string;
  receiverId: string;
  message: string;
  status?: MessageStatus;
  isDeleted?: boolean;
  isEmailed?: boolean;
};

export type UpdateMessageInput = {
  senderId?: string;
  receiverId?: string;
  message?: string;
  status?: MessageStatus;
  isDeleted?: boolean;
  isEmailed?: boolean;
};
