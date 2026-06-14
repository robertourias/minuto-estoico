import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryQuotesDto } from './dto/query-quotes.dto';
import { createHash } from 'crypto';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna todas as citações com filtros opcionais e paginação
   */
  async findAll(query: QueryQuotesDto) {
    const { category, language = 'pt', tag, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { language };

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quote.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retorna uma citação aleatória (excluindo um ID específico para não repetir)
   */
  async findRandom(excludeId?: string) {
    const where: any = { language: 'pt' };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.prisma.quote.count({ where });
    if (count === 0) throw new NotFoundException('Nenhuma citação encontrada');

    const skip = Math.floor(Math.random() * count);
    const quotes = await this.prisma.quote.findMany({
      where,
      skip,
      take: 1,
    });

    return quotes[0];
  }

  /**
   * Retorna a "Citação do Dia" — determinística com base na data atual
   * Usa hash MD5 da data para selecionar um índice fixo
   */
  async findDailyQuote() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const hash = createHash('md5').update(today).digest('hex');
    const hashInt = parseInt(hash.substring(0, 8), 16);

    const total = await this.prisma.quote.count();
    if (total === 0) throw new NotFoundException('Nenhuma citação encontrada');

    const index = hashInt % total;

    const quotes = await this.prisma.quote.findMany({
      skip: index,
      take: 1,
      orderBy: { id: 'asc' },
    });

    return quotes[0];
  }

  /**
   * Retorna uma citação por ID
   */
  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id } });
    if (!quote) throw new NotFoundException(`Citação #${id} não encontrada`);
    return quote;
  }

  /**
   * Lista todas as categorias disponíveis
   */
  async findCategories() {
    const categories = await this.prisma.quote.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  /**
   * Lista todos os autores disponíveis
   */
  async findAuthors() {
    const authors = await this.prisma.quote.findMany({
      select: { author: true },
      distinct: ['author'],
      orderBy: { author: 'asc' },
    });
    return authors.map((a) => a.author);
  }

  /**
   * Retorna citações por autor
   */
  async findByAuthor(author: string) {
    return this.prisma.quote.findMany({
      where: { author: { contains: author, mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
