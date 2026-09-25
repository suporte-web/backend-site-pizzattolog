import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      success: true,
      status: 'online',
      sistema: 'site_pizzattolog_backend',
      dataHora: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    };
  }

  site() {
    return {
      nome: 'Pizzattolog',
      descricao: 'Soluções logísticas inteligentes para conectar negócios.',
    };
  }
}
