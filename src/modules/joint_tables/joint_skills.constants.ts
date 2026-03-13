export const JOINT_SKILL_ENTITY_TYPES = ['student', 'vacancy', 'project', 'employer'] as const;

export type JointSkillEntityType = (typeof JOINT_SKILL_ENTITY_TYPES)[number];
