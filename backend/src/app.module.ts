import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    QuotesModule,
    DatabaseModule, // auto-seed na primeira inicialização
  ],
})
export class AppModule {}
