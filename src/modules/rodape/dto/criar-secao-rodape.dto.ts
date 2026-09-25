import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CriarLinkRodapeDto } from './criar-link-rodape.dto';

export class CriarSecaoRodapeDto {
  @IsString()
  @IsNotEmpty({ message: 'O título da seção é obrigatório.' })
  @MaxLength(120, {
    message: 'O título da seção pode ter no máximo 120 caracteres.',
  })
  titulo: string;

  @IsOptional()
  @IsInt({ message: 'A ordem da seção deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem da seção não pode ser negativa.' })
  ordem?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;

  @IsOptional()
  @IsArray({ message: 'Os links da seção devem ser enviados em uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => CriarLinkRodapeDto)
  links?: CriarLinkRodapeDto[];
}
