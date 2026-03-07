import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(dto: CreateStudentDto) {
    return this.studentRepository.create(dto);
  }

  async findById(studentId: string) {
    return this.studentRepository.findById(studentId);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.studentRepository.list(params);
  }

  async update(studentId: string, dto: UpdateStudentDto) {
    return this.studentRepository.update(studentId, dto);
  }
}
