import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';
import { SkillService } from '../services/skill.service';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get('all')
  listAll() {
    return this.skillService.listAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.skillService.findById(id);
  }

  @Post('create')
  create(@Body() dto: CreateSkillDto) {
    return this.skillService.create(dto);
  }

  @Put()
  update(@Body() dto: UpdateSkillDto) {
    return this.skillService.update(dto);
  }
}
