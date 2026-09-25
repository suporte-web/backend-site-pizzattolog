ALTER TABLE "heroes_pagina_inicial"
  ALTER COLUMN "imagemUrl" SET DEFAULT '/images/home/caminhao-tela-inicial.png';

UPDATE "heroes_pagina_inicial"
SET "imagemUrl" = '/images/home/caminhao-tela-inicial.png'
WHERE "imagemUrl" IS NULL;
