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

export class CriarItemMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do item é obrigatório.' })
  @MaxLength(120, {
    message: 'O título do item pode ter no máximo 120 caracteres.',
  })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug do item é obrigatório.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(140, {
    message: 'O slug do item pode ter no máximo 140 caracteres.',
  })
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do item pode ter no máximo 220 caracteres.',
  })
  url?: string;

  @IsOptional()
  @IsInt({ message: 'A ordem do item deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem do item não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
