import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioAdminAutenticado } from '../types/usuario-admin-autenticado';

export type RequisicaoAdmin = Request & {
  usuarioAdmin?: UsuarioAdminAutenticado;
};

export const UsuarioAtual = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequisicaoAdmin>();

    return request.usuarioAdmin;
  },
);
