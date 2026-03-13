import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '#/common/decorators/roles.decorator';
import { RolesGuard } from '#/common/guards/roles.guard';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { LoginStudentDto } from '../dtos/login-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentService } from '../services/student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(AuthGuard('auth_token'), RolesGuard)
  @Roles({ table: 'universityadmin', roles: ['admin'] })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.studentService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('auth_token'), RolesGuard)
  @Roles({ table: 'universityadmin', roles: ['admin'] })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Post('login')
  login(@Body() dto: LoginStudentDto) {
    return this.studentService.login(dto);
  }

  @Get('profile')
  profile(@Query('studentId') studentId: string) {
    return this.studentService.profile(studentId);
  }
}
