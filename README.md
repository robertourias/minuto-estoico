# 🌿 Minuto Estoico

> *"A filosofia é medicina da alma."* — Cícero

Uma plataforma de reflexão diária inspirada na filosofia estoica. Dedique um minuto do seu dia para uma citação de Marco Aurélio, Sêneca, Epicteto e outros filósofos clássicos.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion |
| Backend | NestJS · TypeScript · Swagger |
| Banco | PostgreSQL · Prisma ORM |
| Infra | Supabase · Vercel (frontend) · Railway (backend) |

---

## Estrutura do projeto

```
minuto-estoico/
├── backend/           # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts        # 70+ citações filosóficas
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── prisma/        # PrismaService global
│       └── quotes/        # Módulo principal
│           ├── quotes.controller.ts
│           ├── quotes.service.ts
│           └── dto/
└── frontend/          # App Next.js
    └── src/
        ├── app/           # App Router
        ├── components/    # QuoteCard, FavoritesDrawer…
        ├── hooks/         # useFavorites
        ├── lib/           # api.ts, utils.ts
        └── types/         # Quote interface
```

---

## Setup rápido (desenvolvimento local)

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ (ou Docker)

### 1. Clone e configure

```bash
# Backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL

# Frontend
cd ../frontend
cp .env.example .env.local
```

### 2. Backend

```bash
cd backend
npm install

# Gera o cliente Prisma e aplica migrations
npx prisma migrate dev --name init

# Popula o banco com as citações
npm run prisma:seed

# Inicia o servidor de desenvolvimento
npm run start:dev
```

API disponível em `http://localhost:3001`
Swagger em `http://localhost:3001/api/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:3000`

---

## Com Docker

```bash
# Na raiz do projeto
docker-compose up -d

# Rode o seed (uma vez)
docker exec minuto-estoico-api npm run prisma:seed
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/quotes` | Lista paginada com filtros |
| GET | `/api/quotes/daily` | Citação do dia (determinística) |
| GET | `/api/quotes/random` | Citação aleatória |
| GET | `/api/quotes/categories` | Todas as categorias |
| GET | `/api/quotes/authors` | Todos os autores |
| GET | `/api/quotes/author/:name` | Citações por autor |
| GET | `/api/quotes/:id` | Citação por ID |

### Parâmetros de `/api/quotes`

| Parâmetro | Tipo | Exemplo |
|-----------|------|---------|
| `category` | string | `Virtude` |
| `tag` | string | `disciplina` |
| `language` | string | `pt` |
| `page` | number | `1` |
| `limit` | number | `10` |

---

## Funcionalidades do MVP

- **Citação do Dia** — mesma para todos os usuários, baseada em hash da data
- **Nova Reflexão** — troca sem recarregar a página, sem repetir a anterior
- **Favoritos** — persistidos em LocalStorage, sem necessidade de login
- **Compartilhamento** — copia texto formatado ou abre WhatsApp
- **Design minimalista** — tipografia serifada, animações suaves com Framer Motion
- **Responsivo** — desktop e mobile

---

## Categorias de citações

`Virtude` · `Coragem` · `Autodisciplina` · `Resiliência` · `Tempo` · `Foco` · `Gratidão` · `Sabedoria` · `Autoconhecimento` · `Aceitação` · `Liderança` · `Persistência`

---

## Roadmap

### Fase 2
- [ ] Login com Google
- [ ] Favoritos sincronizados na nuvem
- [ ] Histórico de reflexões visualizadas
- [ ] Busca por autor ou tema

### Fase 3
- [ ] Notificação diária (PWA)
- [ ] Widget Android/iOS
- [ ] Envio diário por e-mail
- [ ] API pública de citações

### Fase 4
- [ ] Painel administrativo
- [ ] Geração de reflexões por IA
- [ ] Curadoria e aprovação manual

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://user:pass@host:5432/minuto_estoico"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Licença

MIT
