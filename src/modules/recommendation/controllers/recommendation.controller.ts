import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApproveRecommendationAdminDto } from '../dtos/approve-recommendation-admin.dto';
import { ApproveRecommendationTeacherDto } from '../dtos/approve-recommendation-teacher.dto';
import { CreateRecommendationDto } from '../dtos/create-recommendation.dto';
import { SetRecommendationTerminatedDto } from '../dtos/set-recommendation-terminated.dto';
import { VerifyRecommendationDto } from '../dtos/verify-recommendation.dto';
import { RecommendationService } from '../services/recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('all')
  listAll() {
    return this.recommendationService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.recommendationService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.recommendationService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateRecommendationDto) {
    return this.recommendationService.create(dto);
  }

  @Post('approve_admin')
  approveByAdmin(@Body() dto: ApproveRecommendationAdminDto) {
    return this.recommendationService.approveByAdmin(dto);
  }

  @Post('approve_teacher')
  approveByTeacher(@Body() dto: ApproveRecommendationTeacherDto) {
    return this.recommendationService.approveByTeacher(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyRecommendationDto) {
    return this.recommendationService.verifyByStudent(dto.token);
  }

  @Post('terminate')
  setTerminated(@Body() dto: SetRecommendationTerminatedDto) {
    return this.recommendationService.setTerminated(dto);
  }
}
