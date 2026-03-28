'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
    CREATE TYPE "message_status" AS ENUM ('sending', 'unread', 'read');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "messages" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  status "message_status" NOT NULL DEFAULT 'sending',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  is_emailed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "messages_sender_id_idx" ON "messages"(sender_id);
CREATE INDEX IF NOT EXISTS "messages_receiver_id_idx" ON "messages"(receiver_id);
CREATE INDEX IF NOT EXISTS "messages_status_idx" ON "messages"(status);
CREATE INDEX IF NOT EXISTS "messages_is_deleted_idx" ON "messages"(is_deleted);
`;

const downSql = `
DROP TABLE IF EXISTS "messages";
DROP TYPE IF EXISTS "message_status";
`;

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(upSql, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(downSql, { transaction });
    });
  },
};
