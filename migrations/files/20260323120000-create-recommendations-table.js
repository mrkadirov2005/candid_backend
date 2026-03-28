'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recommendation_status') THEN
    CREATE TYPE "recommendation_status" AS ENUM ('pending', 'preparing', 'submitting', 'done');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "recommendations" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  university_id UUID NOT NULL,
  university_admin_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  status "recommendation_status" NOT NULL DEFAULT 'pending',
  content VARCHAR(1000),
  is_teacher_signed BOOLEAN NOT NULL DEFAULT FALSE,
  teacher_signature TEXT,
  verify_token VARCHAR(120),
  verify_token_expires_at TIMESTAMPTZ,
  is_terminated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_recommendations_student
    FOREIGN KEY (student_id)
    REFERENCES "student"(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_recommendations_university
    FOREIGN KEY (university_id)
    REFERENCES "universities"(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_recommendations_university_admin
    FOREIGN KEY (university_admin_id)
    REFERENCES "universityadmin"(admin_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_recommendations_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES "teachers"(teacher_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "recommendations_student_id_idx" ON "recommendations"(student_id);
CREATE INDEX IF NOT EXISTS "recommendations_university_id_idx" ON "recommendations"(university_id);
CREATE INDEX IF NOT EXISTS "recommendations_university_admin_id_idx" ON "recommendations"(university_admin_id);
CREATE INDEX IF NOT EXISTS "recommendations_teacher_id_idx" ON "recommendations"(teacher_id);
CREATE INDEX IF NOT EXISTS "recommendations_status_idx" ON "recommendations"(status);
CREATE INDEX IF NOT EXISTS "recommendations_is_terminated_idx" ON "recommendations"(is_terminated);
`;

const downSql = `
DROP TABLE IF EXISTS "recommendations";
DROP TYPE IF EXISTS "recommendation_status";
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
