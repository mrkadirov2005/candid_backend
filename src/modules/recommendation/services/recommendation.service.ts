import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateRecommendationDto } from '../dtos/create-recommendation.dto';
import { ApproveRecommendationAdminDto } from '../dtos/approve-recommendation-admin.dto';
import { ApproveRecommendationTeacherDto } from '../dtos/approve-recommendation-teacher.dto';
import { SetRecommendationTerminatedDto } from '../dtos/set-recommendation-terminated.dto';
import { RecommendationStatus } from '../models/recommendation.model';
import { RecommendationRepository } from '../repositories/recommendation.repository';

@Injectable()
export class RecommendationService {
  constructor(private readonly recommendationRepository: RecommendationRepository) {}

  async create(dto: CreateRecommendationDto) {
    return this.recommendationRepository.create({
      studentId: dto.studentId,
      universityId: dto.universityId,
      universityAdminId: dto.universityAdminId,
      teacherId: dto.teacherId,
      status: RecommendationStatus.Pending,
      isTeacherSigned: false,
      isTerminated: false,
    });
  }

  async findById(id: string) {
    return this.recommendationRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.recommendationRepository.list(params);
  }

  async listAll() {
    return this.recommendationRepository.listAll();
  }

  async approveByAdmin(dto: ApproveRecommendationAdminDto) {
    const row = await this.recommendationRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Recommendation not found');
    if (row.isTerminated) throw new BadRequestException('Recommendation is terminated');
    if (row.status !== RecommendationStatus.Pending) {
      throw new BadRequestException('Recommendation is not pending');
    }

    return this.recommendationRepository.update(dto.id, {
      universityAdminId: dto.universityAdminId,
      status: RecommendationStatus.Preparing,
    });
  }

  async approveByTeacher(dto: ApproveRecommendationTeacherDto) {
    const row = await this.recommendationRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Recommendation not found');
    if (row.isTerminated) throw new BadRequestException('Recommendation is terminated');
    if (row.status !== RecommendationStatus.Preparing) {
      throw new BadRequestException('Recommendation is not in preparing state');
    }

    const verifyToken = randomUUID();
    const verifyTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updated = await this.recommendationRepository.update(dto.id, {
      teacherId: dto.teacherId,
      content: dto.content,
      teacherSignature: dto.teacherSignature,
      isTeacherSigned: true,
      status: RecommendationStatus.Submitting,
      verifyToken,
      verifyTokenExpiresAt,
    });

    // TODO: generate PDF from HTML content and send email to student using verifyToken.
    return updated;
  }

  async verifyByStudent(token: string) {
    const row = await this.recommendationRepository.findByVerifyToken(token);
    if (!row) throw new BadRequestException('Invalid verification token');
    if (row.isTerminated) throw new BadRequestException('Recommendation is terminated');
    if (row.status !== RecommendationStatus.Submitting) {
      throw new BadRequestException('Recommendation is not in submitting state');
    }
    if (row.verifyTokenExpiresAt && row.verifyTokenExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Verification token has expired');
    }

    return this.recommendationRepository.update(row.id, {
      status: RecommendationStatus.Done,
      verifyToken: null,
      verifyTokenExpiresAt: null,
    });
  }

  async setTerminated(dto: SetRecommendationTerminatedDto) {
    const row = await this.recommendationRepository.findById(dto.id);
    if (!row) throw new NotFoundException('Recommendation not found');

    return this.recommendationRepository.setTerminated(dto.id, dto.isTerminated);
  }
}
