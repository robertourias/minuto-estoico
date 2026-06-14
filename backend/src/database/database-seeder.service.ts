import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QUOTES_DATA } from './quotes-data';

/**
 * DatabaseSeederService
 *
 * Roda automaticamente após a aplicação inicializar.
 * Verifica se o banco está vazio e, se estiver, insere todas as citações.
 * Idempotente: não modifica dados se já existirem registros.
 */
@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.prisma.quote.count();

      if (count > 0) {
        this.logger.log(`Banco já populado: ${count} citações encontradas. Seed ignorado.`);
        return;
      }

      this.logger.log('Banco vazio detectado. Iniciando seed automático...');

      const batchSize = 10;
      let inserted = 0;

      for (let i = 0; i < QUOTES_DATA.length; i += batchSize) {
        const batch = QUOTES_DATA.slice(i, i + batchSize);
        await this.prisma.quote.createMany({ data: batch });
        inserted += batch.length;
      }

      this.logger.log(`✅ Seed automático concluído: ${inserted} citações inseridas.`);
    } catch (error) {
      this.logger.error('Erro no seed automático:', error);
    }
  }
}
