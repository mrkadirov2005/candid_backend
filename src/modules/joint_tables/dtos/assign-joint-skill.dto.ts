import { IsIn, IsUUID } from 'class-validator';
import { JOINT_SKILL_ENTITY_TYPES, type JointSkillEntityType } from '../joint_skills.constants';

export class AssignJointSkillDto {
  @IsUUID('4')
  skillId!: string;

  @IsIn(JOINT_SKILL_ENTITY_TYPES)
  entityType!: JointSkillEntityType;

  @IsUUID('4')
  entityId!: string;
}
