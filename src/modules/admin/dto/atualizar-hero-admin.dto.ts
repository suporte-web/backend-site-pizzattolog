import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class AtualizarHeroAdminDto {
  @IsOptional()
  @IsString()
  @MaxLength(120, {
    message: 'A etiqueta pode ter no máximo 120 caracteres.',
  })
  etiqueta?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, {
    message: 'O título precisa ter pelo menos 5 caracteres.',
  })
  @MaxLength(180, {
    message: 'O título pode ter no máximo 180 caracteres.',
  })
  titulo?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'A descrição precisa ter pelo menos 10 caracteres.',
  })
  @MaxLength(400, {
    message: 'A descrição pode ter no máximo 400 caracteres.',
  })
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A URL da imagem pode ter no máximo 500 caracteres.' })
  imagemUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, {
    message: 'O texto do botão primário pode ter no máximo 80 caracteres.',
  })
  textoBotaoPrimario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do botão primário pode ter no máximo 220 caracteres.',
  })
  urlBotaoPrimario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, {
    message: 'O texto do botão secundário pode ter no máximo 80 caracteres.',
  })
  textoBotaoSecundario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do botão secundário pode ter no máximo 220 caracteres.',
  })
  urlBotaoSecundario?: string;
}
