import { Controller } from "@nestjs/common";
import { Post,Get } from "@nestjs/common";
@Controller('uni_admin')
export class UniversityAdminController {
  constructor() {}
  
  @Post("create")
  createUniAdmin() {
    throw new Error("Function not implemented.");
  }
  @Get("get")
  getUniAdmin() {
    throw new Error("Function not implemented.");
  }
}

