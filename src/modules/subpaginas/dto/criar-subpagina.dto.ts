import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarSubpaginaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título da subpágina é obrigatório.' })
  @MaxLength(140, {
    message: 'O título da subpágina pode ter no máximo 140 caracteres.',
  })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug da subpágina é obrigatório.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(160, {
    message: 'O slug da subpágina pode ter no máximo 160 caracteres.',
  })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'A página pai é obrigatória.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A página pai deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(120, {
    message: 'A página pai pode ter no máximo 120 caracteres.',
  })
  paginaPai: string;

  @IsString()
  @IsNotEmpty({ message: 'O caminho da subpágina é obrigatório.' })
  @MaxLength(220, {
    message: 'O caminho da subpágina pode ter no máximo 220 caracteres.',
  })
  caminho: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A âncora deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(120, {
    message: 'A âncora pode ter no máximo 120 caracteres.',
  })
  ancora?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, {
    message: 'A descrição pode ter no máximo 300 caracteres.',
  })
  descricao?: string;

  @IsOptional()
  @IsInt({ message: 'A ordem da subpágina deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem da subpágina não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
