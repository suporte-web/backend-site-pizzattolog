import { SetMetadata } from '@nestjs/common';
import { PerfilUsuarioAdmin } from '../types/usuario-admin-autenticado';

export const PERFIS_KEY = 'perfis';

export const Perfis = (...perfis: PerfilUsuarioAdmin[]) =>
  SetMetadata(PERFIS_KEY, perfis);
