import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const staffKey = request.headers['x-staff-key'];

    if (staffKey !== 'helpdesk-staff-secret') {
      throw new ForbiddenException('Access denied. Invalid staff key.');
    }

    return true;
  }
}
