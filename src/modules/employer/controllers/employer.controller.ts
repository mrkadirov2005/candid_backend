import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEmployerDto } from '../dtos/create-employer.dto';
import { LoginEmployerDto } from '../dtos/login-employer.dto';
import { UpdateEmployerDto } from '../dtos/update-employer.dto';
import { EmployerService } from '../services/employer.service';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('all')
  listAll() {
    return this.employerService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.employerService.findById(id);
  }

  @Get('login')
  findByEmail(@Query('email') email: string, @Query('password') password: string) {
    return this.employerService.login({email,password} as LoginEmployerDto);
  }
  
  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.employerService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateEmployerDto) {
    return this.employerService.create(dto);
  }

  @Put()
  update(@Body() dto: UpdateEmployerDto) {
    return this.employerService.update(dto);
  }

  @Post('login')
  login(@Body() dto: LoginEmployerDto) {
    return this.employerService.login(dto);
  }

  @Post('register')
  register(@Body() dto: CreateEmployerDto) {
    return this.employerService.register(dto);
  }

  @Get('profile')
  profile(@Query('employerId') employerId: string) {
    return this.employerService.profile(employerId);
  }
}
