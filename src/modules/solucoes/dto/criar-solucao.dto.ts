import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CriarSolucaoDto {
  @IsString()
  @IsNotEmpty({ message: 'O título da solução é obrigatório.' })
  @MaxLength(120, {
    message: 'O título da solução pode ter no máximo 120 caracteres.',
  })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug da solução é obrigatório.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(140, {
    message: 'O slug da solução pode ter no máximo 140 caracteres.',
  })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da solução é obrigatória.' })
  @MinLength(10, {
    message: 'A descrição precisa ter pelo menos 10 caracteres.',
  })
  @MaxLength(360, {
    message: 'A descrição pode ter no máximo 360 caracteres.',
  })
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, {
    message: 'O ícone pode ter no máximo 80 caracteres.',
  })
  icone?: string;

  @IsOptional()
  @IsInt({ message: 'A ordem da solução deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem da solução não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;
}
