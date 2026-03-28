import { type RecommendationStatus } from '#/modules/recommendation/models/recommendation.model';

export type CreateRecommendationInput = {
  studentId: string;
  universityId: string;
  universityAdminId: string;
  teacherId: string;
  status?: RecommendationStatus;
  content?: string | null;
  isTeacherSigned?: boolean;
  teacherSignature?: string | null;
  verifyToken?: string | null;
  verifyTokenExpiresAt?: Date | null;
  isTerminated?: boolean;
};

export type UpdateRecommendationInput = {
  studentId?: string;
  universityId?: string;
  universityAdminId?: string;
  teacherId?: string;
  status?: RecommendationStatus;
  content?: string | null;
  isTeacherSigned?: boolean;
  teacherSignature?: string | null;
  verifyToken?: string | null;
  verifyTokenExpiresAt?: Date | null;
  isTerminated?: boolean;
};
