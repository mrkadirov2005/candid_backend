'use strict';

const upSql = `
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE;
`;

const downSql = `
ALTER TABLE "users" 
DROP COLUMN IF EXISTS "email";
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
