import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERFIS_KEY } from '../decorators/perfis.decorator';
import { RequisicaoAdmin } from '../decorators/usuario-atual.decorator';
import { PerfilUsuarioAdmin } from '../types/usuario-admin-autenticado';

@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const perfisPermitidos = this.reflector.getAllAndOverride<
      PerfilUsuarioAdmin[]
    >(PERFIS_KEY, [context.getHandler(), context.getClass()]);

    if (!perfisPermitidos?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequisicaoAdmin>();
    const usuario = request.usuarioAdmin;

    if (!usuario || !perfisPermitidos.includes(usuario.perfil)) {
      throw new ForbiddenException('Perfil sem permissão para esta ação.');
    }

    return true;
  }
}
