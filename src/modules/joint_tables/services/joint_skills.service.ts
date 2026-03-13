import { Injectable } from '@nestjs/common';
import { EmployerRepository } from '../../employer/repositories/employer.repository';
import { ProjectRepository } from '../../project/repositories/project.repository';
import { SkillRepository } from '../../skill/repositories/skill.repository';
import { StudentRepository } from '../../student/repositories/student.repository';
import { VacancyRepository } from '../../vacancy/repositories/vacancy.repository';
import { AssignJointSkillDto } from '../dtos/assign-joint-skill.dto';
import { type JointSkillEntityType } from '../joint_skills.constants';
import { JointSkillsRepository } from '../repositories/joint_skills.repository';

@Injectable()
export class JointSkillsService {
  constructor(
    private readonly jointSkillsRepository: JointSkillsRepository,
    private readonly skillRepository: SkillRepository,
    private readonly studentRepository: StudentRepository,
    private readonly vacancyRepository: VacancyRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly employerRepository: EmployerRepository,
  ) {}

  async assignSkill(dto: AssignJointSkillDto) {
    const skill = await this.skillRepository.findById(dto.skillId);
    if (!skill) {
      return null;
    }

    const targetExists = await this.checkTargetExists(dto.entityType, dto.entityId);
    if (!targetExists) {
      return null;
    }

    return this.jointSkillsRepository.assignSkill({
      skillId: dto.skillId,
      entityType: dto.entityType,
      entityId: dto.entityId,
    });
  }

  private async checkTargetExists(entityType: JointSkillEntityType, entityId: string) {
    switch (entityType) {
      case 'student': {
        const row = await this.studentRepository.findById(entityId);
        return Boolean(row);
      }
      case 'vacancy': {
        const row = await this.vacancyRepository.findById(entityId);
        return Boolean(row);
      }
      case 'project': {
        const row = await this.projectRepository.findById(entityId);
        return Boolean(row);
      }
      case 'employer': {
        const row = await this.employerRepository.findById(entityId);
        return Boolean(row);
      }
      default:
        return false;
    }
  }
}
