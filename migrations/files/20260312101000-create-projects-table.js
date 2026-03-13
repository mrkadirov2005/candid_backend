'use strict';

const upSql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "projects" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  student_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  university_id UUID NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_projects_student
    FOREIGN KEY (student_id)
    REFERENCES "student"(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_projects_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES "teachers"(teacher_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_projects_university
    FOREIGN KEY (university_id)
    REFERENCES "universities"(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "projects_student_id_idx" ON "projects"(student_id);
CREATE INDEX IF NOT EXISTS "projects_teacher_id_idx" ON "projects"(teacher_id);
CREATE INDEX IF NOT EXISTS "projects_university_id_idx" ON "projects"(university_id);
CREATE INDEX IF NOT EXISTS "projects_is_active_idx" ON "projects"(is_active);
CREATE INDEX IF NOT EXISTS "projects_is_approved_idx" ON "projects"(is_approved);
`;

const downSql = `
DROP TABLE IF EXISTS "projects";
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
