import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggedInGuard } from '../../auth/guards/loggedIn.guard';
import { Allowlist } from '../allowlist.model';
import { AllowlistService } from '../allowlist.service';

@Injectable()
export class IsAdminGuard extends LoggedInGuard implements CanActivate {
  constructor(private allowlistService: AllowlistService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { session, params, body } = request;

    if (!session || !params || !body) return false;

    const allowlistId = parseInt(params.id);

    return this.allowlistService
      .findOne(allowlistId)
      .then((allowlist: Allowlist) => allowlist.admins.includes(body.address));
  }
}
