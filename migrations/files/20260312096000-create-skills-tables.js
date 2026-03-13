'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "skills" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_entity_type') THEN
    CREATE TYPE "skill_entity_type" AS ENUM ('project', 'student', 'vacancy');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "skill_links" (
  skill_id UUID NOT NULL,
  entity_type "skill_entity_type" NOT NULL,
  entity_id UUID NOT NULL,
  PRIMARY KEY (skill_id, entity_type, entity_id),
  CONSTRAINT fk_skill_links_skill
    FOREIGN KEY (skill_id)
    REFERENCES "skills"(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
`;

const downSql = `
DROP TABLE IF EXISTS "skill_links";
DROP TABLE IF EXISTS "skills";
DROP TYPE IF EXISTS "skill_entity_type";
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
