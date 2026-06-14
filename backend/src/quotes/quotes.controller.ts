import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { QueryQuotesDto } from './dto/query-quotes.dto';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar citações',
    description: 'Retorna lista paginada de citações com filtros opcionais por categoria, idioma e tag.',
  })
  findAll(@Query() query: QueryQuotesDto) {
    return this.quotesService.findAll(query);
  }

  @Get('daily')
  @ApiOperation({
    summary: 'Citação do Dia',
    description: 'Retorna a citação determinística do dia, igual para todos os usuários.',
  })
  findDailyQuote() {
    return this.quotesService.findDailyQuote();
  }

  @Get('random')
  @ApiOperation({
    summary: 'Citação aleatória',
    description: 'Retorna uma citação aleatória. Passe excludeId para evitar repetição.',
  })
  @ApiQuery({ name: 'excludeId', required: false, description: 'ID da citação a excluir do sorteio' })
  findRandom(@Query('excludeId') excludeId?: string) {
    return this.quotesService.findRandom(excludeId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorias', description: 'Retorna todas as categorias disponíveis.' })
  findCategories() {
    return this.quotesService.findCategories();
  }

  @Get('authors')
  @ApiOperation({ summary: 'Listar autores', description: 'Retorna todos os autores disponíveis.' })
  findAuthors() {
    return this.quotesService.findAuthors();
  }

  @Get('author/:author')
  @ApiOperation({ summary: 'Citações por autor' })
  @ApiParam({ name: 'author', description: 'Nome do autor (busca parcial)' })
  findByAuthor(@Param('author') author: string) {
    return this.quotesService.findByAuthor(author);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar citação por ID' })
  @ApiParam({ name: 'id', description: 'UUID da citação' })
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }
}
