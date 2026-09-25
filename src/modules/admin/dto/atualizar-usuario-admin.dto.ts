import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PerfilUsuarioAdmin } from '../types/usuario-admin-autenticado';

export class AtualizarUsuarioAdminDto {
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'O nome pode ter no máximo 120 caracteres.' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres.' })
  @MaxLength(120, { message: 'A senha pode ter no máximo 120 caracteres.' })
  senha?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'MARKETING'], {
    message: 'O perfil deve ser ADMIN ou MARKETING.',
  })
  perfil?: PerfilUsuarioAdmin;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
