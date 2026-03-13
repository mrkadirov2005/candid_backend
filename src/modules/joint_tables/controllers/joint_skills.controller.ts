import { Body, Controller, Post } from '@nestjs/common';
import { AssignJointSkillDto } from '../dtos/assign-joint-skill.dto';
import { JointSkillsService } from '../services/joint_skills.service';

@Controller('joints')
export class JointSkillsController {
  constructor(private readonly jointSkillsService: JointSkillsService) {}

  @Post('skills')
  assignSkill(@Body() dto: AssignJointSkillDto) {
    return this.jointSkillsService.assignSkill(dto);
  }
}
