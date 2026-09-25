import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class CriptografiaSenhaService {
  gerarHash(senha: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(senha, salt, 64).toString('hex');

    return `scrypt:${salt}:${hash}`;
  }

  validarSenha(senha: string, senhaHash: string) {
    const [algoritmo, salt, hash] = senhaHash.split(':');

    if (algoritmo !== 'scrypt' || !salt || !hash) {
      return false;
    }

    const hashInformado = scryptSync(senha, salt, 64);
    const hashSalvo = Buffer.from(hash, 'hex');

    if (hashInformado.length !== hashSalvo.length) {
      return false;
    }

    return timingSafeEqual(hashInformado, hashSalvo);
  }
}
