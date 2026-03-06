'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "teachers" (
  teacher_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  university_id UUID NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  specialty VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_teachers_user
    FOREIGN KEY (user_id)
    REFERENCES "users"(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_teachers_university
    FOREIGN KEY (university_id)
    REFERENCES "universities"(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS teachers_university_id_idx
  ON "teachers"(university_id);
`;

const downSql = `
DROP TABLE IF EXISTS "teachers";
`;

/** @type {import('sequelize-cli').Migration} */
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

