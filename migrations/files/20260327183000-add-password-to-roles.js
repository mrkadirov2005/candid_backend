'use strict';

const upSql = `
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "password" TEXT;
ALTER TABLE "universityadmin" ADD COLUMN IF NOT EXISTS "password" TEXT;
ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "password" TEXT;
`;

const downSql = `
ALTER TABLE "teachers" DROP COLUMN IF EXISTS "password";
ALTER TABLE "universityadmin" DROP COLUMN IF EXISTS "password";
ALTER TABLE "student" DROP COLUMN IF EXISTS "password";
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
