import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { sql } from 'drizzle-orm';
import { DatabaseService } from '#/modules/database/database.service';
import { ROLES_KEY, type RolesMetadata } from '../decorators/roles.decorator';

const ALLOWED_TABLES = new Set(['universityadmin', 'student', 'invites']);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesMetadata = this.reflector.getAllAndOverride<RolesMetadata>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: no user role found');
    }

    if (!rolesMetadata.roles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    const { table } = rolesMetadata;

    if (!ALLOWED_TABLES.has(table)) {
      throw new ForbiddenException('Access denied: invalid resource');
    }

    // Table name is validated against ALLOWED_TABLES whitelist above, safe for sql.raw
    const result = await this.databaseService.db.execute(
      sql`SELECT 1 FROM ${sql.raw(`"${table}"`)} WHERE user_id = ${user.userId} LIMIT 1`,
    );

    if (!result.rows.length) {
      throw new ForbiddenException('Access denied: user not found in resource');
    }

    return true;
  }
}
