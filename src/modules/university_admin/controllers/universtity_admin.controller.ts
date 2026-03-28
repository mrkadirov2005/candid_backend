import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUniversityAdminDto } from '../dtos/create-university-admin.dto';
import { LoginUniversityAdminDto } from '../dtos/login-university-admin.dto';
import { UpdateUniversityAdminDto } from '../dtos/update-university-admin.dto';
import { UniversityAdminService } from '../services/university_admin.service';

@Controller('university_admin')
export class UniversityAdminController {
  constructor(private readonly universityAdminService: UniversityAdminService) {}

  @Post('create')
  createUniAdmin(@Body() dto: CreateUniversityAdminDto) {
    return this.universityAdminService.create(dto);
  }

  @Get('get')
  getUniAdmin(@Query('adminId') adminId: string) {
    return this.universityAdminService.findById(adminId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.universityAdminService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.universityAdminService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Put()
  update(@Body() dto: UpdateUniversityAdminDto) {
    return this.universityAdminService.update(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUniversityAdminDto) {
    return this.universityAdminService.login(dto);
  }

  @Get('profile')
  profile(@Query('adminId') adminId: string) {
    return this.universityAdminService.profile(adminId);
  }
}
