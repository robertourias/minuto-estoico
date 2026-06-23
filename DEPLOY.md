# 🚀 Guia de Deploy — Stack Gratuita

> Supabase (banco) → Render (backend) → Vercel (frontend)
> Tempo estimado: ~20 minutos

---

## Passo 1 — Supabase (banco de dados)

1. Acesse [supabase.com](https://supabase.com) → **Start your project**
2. Crie um novo projeto (escolha a região mais próxima, ex: `South America (São Paulo)`)
3. Aguarde ~2 minutos até o banco estar pronto
4. Vá em **Project Settings → Database**
5. Copie as duas URLs:

```
# Em "Connection string" → selecione "URI"
DATABASE_URL = postgresql://postgres.XXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Mesma URL mas com porta 5432 (sem pgbouncer)
DIRECT_URL   = postgresql://postgres.XXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

> ⚠️ A `DATABASE_URL` usa **porta 6543** (pooler). A `DIRECT_URL` usa **porta 5432** (direta). Ambas são necessárias.

---

## Passo 2 — Render (backend NestJS)

### 2.1 Criar o serviço

1. Acesse [render.com](https://render.com) → **New → Web Service**
2. Conecte sua conta GitHub e selecione o repositório `minuto-estoico`
3. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `minuto-estoico-api` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm ci && npx prisma generate && npm run build` |
| **Start Command** | `npm run start:render` |
| **Instance Type** | `Free` |

### 2.2 Variáveis de ambiente

Em **Environment → Add Environment Variable**, adicione:

| Chave | Valor |
|-------|-------|
| `DATABASE_URL` | *(URL do pooler Supabase, porta 6543)* |
| `DIRECT_URL` | *(URL direta Supabase, porta 5432)* |
| `PORT` | `3021` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://minuto-estoico.vercel.app` *(ajuste após criar na Vercel)* |

### 2.3 Deploy e seed

1. Clique em **Create Web Service** — o Render vai buildar e subir a API
2. Aguarde aparecer **"Your service is live"**
3. Copie a URL gerada, ex: `https://minuto-estoico-api.onrender.com`
4. Abra a aba **Shell** e rode o seed:

```bash
npm run prisma:seed
```

> ✅ Você verá: `✨ Seed concluído! 83 citações disponíveis no banco de dados.`

5. Teste a API:
```
https://minuto-estoico-api.onrender.com/api/quotes/daily
https://minuto-estoico-api.onrender.com/api/docs
```

---

## Passo 3 — Vercel (frontend Next.js)

### 3.1 Criar o projeto

1. Acesse [vercel.com](https://vercel.com) → **Add New → Project**
2. Importe o repositório `minuto-estoico`
3. Configure:

| Campo | Valor |
|-------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Next.js` (detectado automaticamente) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

### 3.2 Variável de ambiente

Em **Environment Variables**, adicione:

| Chave | Valor |
|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://minuto-estoico-api.onrender.com/api` |

### 3.3 Deploy

1. Clique em **Deploy**
2. Aguarde o build (~2 min)
3. Acesse a URL gerada, ex: `https://minuto-estoico.vercel.app`

---

## Passo 4 — Atualizar CORS no Render

Agora que você tem a URL da Vercel, volte ao Render e atualize:

| Chave | Valor |
|-------|-------|
| `FRONTEND_URL` | `https://minuto-estoico.vercel.app` |

O Render fará redeploy automático.

---

## Fluxo de atualizações

A cada `git push origin main`:
- **Render** redeploya o backend automaticamente
- **Vercel** redeploya o frontend automaticamente

### Atualização no VPS (Docker)

Se o projeto estiver rodando via `docker-compose.prod.yml` numa VPS:

```bash
ssh usuario@seu-ip-da-vps
cd /caminho/do/minuto-estoico
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

> 💡 O `--build` é obrigatório — sem ele o Docker reaplica os containers antigos e ignora o código novo.

> 💡 Se só um serviço mudou, rebuilde só ele para economizar tempo: `docker compose -f docker-compose.prod.yml up -d --build backend` (ou `frontend`).

---

## Resumo das URLs finais

| Serviço | URL |
|---------|-----|
| Frontend | `https://minuto-estoico.vercel.app` |
| API | `https://minuto-estoico-api.onrender.com/api` |
| Swagger | `https://minuto-estoico-api.onrender.com/api/docs` |
| Banco | Painel Supabase |

---

## ⚠️ Limitação do free tier do Render

O serviço **dorme após 15 minutos sem requisições**. O primeiro acesso após o sono demora ~30 segundos para acordar.

Para MVPs e validação isso é aceitável. Quando quiser remover o sleep, o plano pago do Render começa em $7/mês.

---

## Troubleshooting

**Build falha no Render com erro de Prisma**
→ Verifique se `DATABASE_URL` e `DIRECT_URL` estão corretas nas variáveis do Render.

**CORS error no browser**
→ Confirme que `FRONTEND_URL` no Render contém exatamente a URL da Vercel (sem barra no final).

**Citações não aparecem (banco vazio)**
→ Abra o Shell do Render e rode `npm run prisma:seed`.

**Frontend com erro "Não foi possível conectar à API"**
→ Confirme que `NEXT_PUBLIC_API_URL` na Vercel aponta para a URL correta do Render.
