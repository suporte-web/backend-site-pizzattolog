import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RequisicaoAdmin } from '../decorators/usuario-atual.decorator';
import { TokenAdminService } from '../services/token-admin.service';

@Injectable()
export class AutenticacaoAdminGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenAdminService: TokenAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequisicaoAdmin>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de acesso não informado.');
    }

    const token = authorization.replace('Bearer ', '').trim();
    const payload = this.tokenAdminService.verificar(token);

    const usuario = await this.prisma.usuarioAdmin.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Usuário sem acesso ao painel admin.');
    }

    request.usuarioAdmin = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    return true;
  }
}
