import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async addUser(dto: CreateUserDto) {
    return this.userRepository.create(dto);
  }

  async verify(userId: string) {
    return this.userRepository.findById(userId);
  }

  async refreshToken(dto: RefreshTokenDto) {
    return this.userRepository.updateRefreshToken(dto.userId, dto.refreshToken);
  }

  async activate(userId: string) {
    return this.userRepository.setActive(userId, true);
  }

  async deactivate(userId: string) {
    return this.userRepository.setActive(userId, false);
  }
}
