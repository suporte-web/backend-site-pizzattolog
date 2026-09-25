import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarLinkRodapeDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do link é obrigatório.' })
  @MaxLength(120, {
    message: 'O título do link pode ter no máximo 120 caracteres.',
  })
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do link pode ter no máximo 220 caracteres.',
  })
  url?: string;

  @IsOptional()
  @IsInt({ message: 'A ordem do link deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem do link não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
