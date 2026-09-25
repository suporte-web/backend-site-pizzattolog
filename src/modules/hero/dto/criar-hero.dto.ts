import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CriarHeroDto {
  @IsString()
  @IsNotEmpty({ message: 'A etiqueta do hero é obrigatória.' })
  @MaxLength(120, {
    message: 'A etiqueta pode ter no máximo 120 caracteres.',
  })
  etiqueta: string;

  @IsString()
  @IsNotEmpty({ message: 'O título do hero é obrigatório.' })
  @MinLength(5, {
    message: 'O título precisa ter pelo menos 5 caracteres.',
  })
  @MaxLength(180, {
    message: 'O título pode ter no máximo 180 caracteres.',
  })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do hero é obrigatória.' })
  @MinLength(10, {
    message: 'A descrição precisa ter pelo menos 10 caracteres.',
  })
  @MaxLength(400, {
    message: 'A descrição pode ter no máximo 400 caracteres.',
  })
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'A URL da imagem pode ter no máximo 500 caracteres.',
  })
  imagemUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'O texto do botão primário é obrigatório.' })
  @MaxLength(80, {
    message: 'O texto do botão primário pode ter no máximo 80 caracteres.',
  })
  textoBotaoPrimario: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do botão primário pode ter no máximo 220 caracteres.',
  })
  urlBotaoPrimario?: string;

  @IsString()
  @IsNotEmpty({ message: 'O texto do botão secundário é obrigatório.' })
  @MaxLength(80, {
    message: 'O texto do botão secundário pode ter no máximo 80 caracteres.',
  })
  textoBotaoSecundario: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do botão secundário pode ter no máximo 220 caracteres.',
  })
  urlBotaoSecundario?: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
