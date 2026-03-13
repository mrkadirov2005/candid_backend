import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { SetProjectFlagDto } from '../dtos/set-project-flag.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { ProjectService } from '../services/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('all')
  listAll() {
    return this.projectService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.projectService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put()
  update(@Body() dto: UpdateProjectDto) {
    return this.projectService.update(dto);
  }

  @Post('verify')
  verify(@Body() dto: SetProjectFlagDto) {
    return this.projectService.verify(dto.id);
  }

  @Post('unverify')
  unverify(@Body() dto: SetProjectFlagDto) {
    return this.projectService.unverify(dto.id);
  }

  @Post('request_verify')
  requestVerify(@Body() dto: SetProjectFlagDto) {
    return this.projectService.requestVerify(dto.id);
  }

  @Post('deactivate')
  deactivate(@Body() dto: SetProjectFlagDto) {
    return this.projectService.deactivate(dto.id);
  }
}
