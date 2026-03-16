'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        CREATE TABLE IF NOT EXISTS message (
          message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sender_user_id UUID NOT NULL,
          receiver_user_id UUID NOT NULL,
          content TEXT NOT NULL,
          context_type TEXT,
          context_id UUID,
          attachment_links JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        `,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `DROP TABLE IF EXISTS message;`,
        { transaction },
      );
    });
  },
};