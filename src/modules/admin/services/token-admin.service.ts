import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PerfilUsuarioAdmin } from '../types/usuario-admin-autenticado';

interface PayloadTokenAdmin {
  sub: string;
  email: string;
  perfil: PerfilUsuarioAdmin;
  exp: number;
}

@Injectable()
export class TokenAdminService {
  constructor(private readonly configService: ConfigService) {}

  gerar(payload: Omit<PayloadTokenAdmin, 'exp'>) {
    const agoraEmSegundos = Math.floor(Date.now() / 1000);
    const exp = agoraEmSegundos + this.obterExpiracaoSegundos();
    const cabecalho = this.codificarBase64Url({
      alg: 'HS256',
      typ: 'JWT',
    });
    const corpo = this.codificarBase64Url({
      ...payload,
      exp,
    });
    const assinatura = this.assinar(`${cabecalho}.${corpo}`);

    return `${cabecalho}.${corpo}.${assinatura}`;
  }

  verificar(token: string): PayloadTokenAdmin {
    const [cabecalho, corpo, assinatura] = token.split('.');

    if (!cabecalho || !corpo || !assinatura) {
      throw new UnauthorizedException('Token de acesso inválido.');
    }

    const assinaturaEsperada = this.assinar(`${cabecalho}.${corpo}`);

    if (!this.compararAssinatura(assinatura, assinaturaEsperada)) {
      throw new UnauthorizedException('Token de acesso inválido.');
    }

    const payload = JSON.parse(
      Buffer.from(corpo, 'base64url').toString('utf8'),
    ) as PayloadTokenAdmin;

    if (!payload.sub || !payload.email || !payload.perfil || !payload.exp) {
      throw new UnauthorizedException('Token de acesso inválido.');
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token de acesso expirado.');
    }

    return payload;
  }

  obterExpiracaoSegundos() {
    const horas = this.configService.get<number>(
      'ADMIN_TOKEN_EXPIRACAO_HORAS',
      8,
    );

    return horas * 60 * 60;
  }

  private codificarBase64Url(valor: unknown) {
    return Buffer.from(JSON.stringify(valor)).toString('base64url');
  }

  private assinar(valor: string) {
    return createHmac('sha256', this.obterSegredo())
      .update(valor)
      .digest('base64url');
  }

  private compararAssinatura(recebida: string, esperada: string) {
    const recebidaBuffer = Buffer.from(recebida);
    const esperadaBuffer = Buffer.from(esperada);

    if (recebidaBuffer.length !== esperadaBuffer.length) {
      return false;
    }

    return timingSafeEqual(recebidaBuffer, esperadaBuffer);
  }

  private obterSegredo() {
    const segredo = this.configService.get<string>('ADMIN_JWT_SECRET');

    if (segredo) {
      return segredo;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_JWT_SECRET precisa ser configurado em produção.');
    }

    return 'segredo-local-admin-pizzattolog';
  }
}
