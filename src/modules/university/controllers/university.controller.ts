import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUniversityDto } from '../dtos/create-university.dto';
import { SetUniversityActiveDto } from '../dtos/set-university-active.dto';
import { UpdateUniversityDto } from '../dtos/update-university.dto';
import { UniversityService } from '../services/university.service';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('all')
  listAll() {
    return this.universityService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.universityService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.universityService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }

  @Post('activate')
  activate(@Body() dto: SetUniversityActiveDto) {
    return this.universityService.activate(dto.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
    return this.universityService.update(id, dto);
  }

  @Post('deactivate')
  deactivate(@Body() dto: SetUniversityActiveDto) {
    return this.universityService.deactivate(dto.id);
  }
}
