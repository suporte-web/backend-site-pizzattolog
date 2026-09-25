import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StatusPaginaDto } from '../../paginas/dto/criar-pagina.dto';

export class AtualizarPaginaAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'O título precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(150, {
    message: 'O título pode ter no máximo 150 caracteres.',
  })
  titulo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  @MaxLength(160, {
    message: 'O slug pode ter no máximo 160 caracteres.',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, {
    message: 'O resumo pode ter no máximo 300 caracteres.',
  })
  resumo?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'O conteúdo precisa ter pelo menos 10 caracteres.',
  })
  conteudo?: string;

  @IsOptional()
  @IsIn(['RASCUNHO', 'PUBLICADA', 'ARQUIVADA'], {
    message: 'O status deve ser RASCUNHO, PUBLICADA ou ARQUIVADA.',
  })
  status?: StatusPaginaDto;

  @IsOptional()
  @IsBoolean({
    message: 'O campo ativo deve ser verdadeiro ou falso.',
  })
  ativo?: boolean;
}
