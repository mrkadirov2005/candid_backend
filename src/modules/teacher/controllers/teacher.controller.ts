import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';
import { LoginTeacherDto } from '../dtos/login-teacher.dto';
import { UpdateTeacherDto } from '../dtos/update-teacher.dto';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.createFromDto(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.teacherService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.teacherService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Put()
  update(@Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(dto);
  }

  @Post('login')
  login(@Body() dto: LoginTeacherDto) {
    return this.teacherService.login(dto);
  }

  @Get('profile')
  profile(@Query('teacherId') teacherId: string) {
    return this.teacherService.profile(teacherId);
  }
}
