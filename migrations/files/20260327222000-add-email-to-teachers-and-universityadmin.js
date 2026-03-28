'use strict';

const upSql = `
ALTER TABLE "teachers"
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE;

ALTER TABLE "universityadmin"
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE;
`;

const downSql = `
ALTER TABLE "teachers"
DROP COLUMN IF EXISTS "email";

ALTER TABLE "universityadmin"
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
