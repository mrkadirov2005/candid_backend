export type JointSkillEntityType = 'vacancy' | 'project' | 'student' | 'employer';

export type AssignJointSkillInput = {
  skillId: string;
  entityType: JointSkillEntityType;
  entityId: string;
};
