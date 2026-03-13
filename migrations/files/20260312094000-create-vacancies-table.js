'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vacancy_mode') THEN
    CREATE TYPE "vacancy_mode" AS ENUM ('online', 'offline', 'hybrid');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vacancy_type') THEN
    CREATE TYPE "vacancy_type" AS ENUM ('internship', 'job');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "vacancies" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL,
  description TEXT NOT NULL,
  company VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  mode "vacancy_mode" NOT NULL,
  type "vacancy_type" NOT NULL,
  salary INTEGER NOT NULL,
  is_expired BOOLEAN NOT NULL DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_vacancies_employer
    FOREIGN KEY (employer_id)
    REFERENCES "users"(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "vacancies_employer_id_idx" ON "vacancies"(employer_id);
CREATE INDEX IF NOT EXISTS "vacancies_is_expired_idx" ON "vacancies"(is_expired);
`;

const downSql = `
DROP TABLE IF EXISTS "vacancies";
DROP TYPE IF EXISTS "vacancy_type";
DROP TYPE IF EXISTS "vacancy_mode";
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
