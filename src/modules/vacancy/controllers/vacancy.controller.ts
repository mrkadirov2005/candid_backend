import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { SetVacancyExpiredDto } from '../dtos/set-vacancy-expired.dto';
import { UpdateVacancyDto } from '../dtos/update-vacancy.dto';
import { VacancyService } from '../services/vacancy.service';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Get('all')
  listAll() {
    return this.vacancyService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vacancyService.findById(id);
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.vacancyService.list({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateVacancyDto) {
    return this.vacancyService.create(dto);
  }

  @Post('activate')
  activate(@Body() dto: SetVacancyExpiredDto) {
    return this.vacancyService.activate(dto.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacancyService.update(id, dto);
  }

  @Post('deactivate')
  deactivate(@Body() dto: SetVacancyExpiredDto) {
    return this.vacancyService.deactivate(dto.id);
  }
}
