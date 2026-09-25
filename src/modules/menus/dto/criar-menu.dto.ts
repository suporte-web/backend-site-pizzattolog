import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CriarItemMenuDto } from './criar-item-menu.dto';

export class CriarMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do menu é obrigatório.' })
  @MaxLength(120, {
    message: 'O título do menu pode ter no máximo 120 caracteres.',
  })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug do menu é obrigatório.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(140, {
    message: 'O slug do menu pode ter no máximo 140 caracteres.',
  })
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(220, {
    message: 'A URL do menu pode ter no máximo 220 caracteres.',
  })
  url?: string;

  @IsOptional()
  @IsInt({ message: 'A ordem do menu deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem do menu não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;

  @IsOptional()
  @IsArray({ message: 'Os itens do menu devem ser enviados em uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => CriarItemMenuDto)
  itens?: CriarItemMenuDto[];
}
