export type CreateMessageInput = {
  senderUserId: string;
  receiverUserId: string;
  content: string;
  contextType?: string | null;
  contextId?: string | null;
  attachmentLinks?: string[] | null;
};

export type UpdateMessageInput = {
  content?: string;
  contextType?: string | null;
  contextId?: string | null;
  attachmentLinks?: string[] | null;
};
