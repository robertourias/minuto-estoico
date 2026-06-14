import { PrismaClient } from '@prisma/client';
import { QUOTES_DATA } from '../src/database/quotes-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  console.log(`📚 Inserindo ${QUOTES_DATA.length} citações filosóficas estoicas...`);

  await prisma.quote.deleteMany();

  const batchSize = 10;
  for (let i = 0; i < QUOTES_DATA.length; i += batchSize) {
    const batch = QUOTES_DATA.slice(i, i + batchSize);
    await prisma.quote.createMany({ data: batch });
    console.log(`  ✅ ${Math.min(i + batchSize, QUOTES_DATA.length)} / ${QUOTES_DATA.length}`);
  }

  const total = await prisma.quote.count();
  console.log(`\n✨ Seed concluído! ${total} citações disponíveis.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
