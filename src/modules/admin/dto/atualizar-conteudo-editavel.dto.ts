import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AtualizarConteudoEditavelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A página não pode ficar vazia.' })
  @MaxLength(120, { message: 'A página pode ter no máximo 120 caracteres.' })
  pagina?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O rótulo não pode ficar vazio.' })
  @MaxLength(160, { message: 'O rótulo pode ter no máximo 160 caracteres.' })
  rotulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180, { message: 'O título pode ter no máximo 180 caracteres.' })
  titulo?: string;

  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A URL da imagem pode ter no máximo 500 caracteres.' })
  imagemUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
