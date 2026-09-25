import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CriarSecaoRodapeDto } from './criar-secao-rodape.dto';

export class CriarRodapeDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
  @MaxLength(120, {
    message: 'O nome da empresa pode ter no máximo 120 caracteres.',
  })
  nomeEmpresa: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do rodapé é obrigatória.' })
  @MinLength(10, {
    message: 'A descrição precisa ter pelo menos 10 caracteres.',
  })
  @MaxLength(360, {
    message: 'A descrição pode ter no máximo 360 caracteres.',
  })
  descricao: string;

  @IsString()
  @IsNotEmpty({ message: 'O texto de direitos autorais é obrigatório.' })
  @MaxLength(180, {
    message: 'O texto de direitos autorais pode ter no máximo 180 caracteres.',
  })
  direitosAutorais: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  ativo?: boolean;

  @IsOptional()
  @IsArray({ message: 'As seções do rodapé devem ser enviadas em uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => CriarSecaoRodapeDto)
  secoes?: CriarSecaoRodapeDto[];
}
