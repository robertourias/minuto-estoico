# Dark Mode — Design

## Objetivo
Adicionar toggle de dark mode no header da home, com troca visual completa da UI (header, quote card, favoritos, badges, footer), respeitando a preferência do sistema por padrão e persistindo a escolha do usuário.

## Abordagem
Usar a lib **next-themes** (já recomendada para Next.js App Router + Tailwind `dark` class strategy):
- Resolve flash de tema incorreto no load (script inline antes da hidratação)
- Lê `prefers-color-scheme` do sistema como padrão
- Persiste escolha do usuário em `localStorage`
- Tailwind já está configurado com `darkMode: 'class'` — compatível sem mudanças no config

## Setup
1. Adicionar dependência `next-themes` ao `frontend/package.json`
2. `frontend/src/app/layout.tsx`:
   - `<html lang="pt-BR" className={inter.variable} suppressHydrationWarning>`
   - Envolver `{children}` em `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`

## Componente: ThemeToggle
Novo arquivo `frontend/src/components/ThemeToggle.tsx`:
- Client component, `'use client'`
- `useTheme()` do next-themes → `{ resolvedTheme, setTheme }`
- Padrão mounted-guard (`useState` + `useEffect`) pra evitar hydration mismatch — renderiza `null` (ou placeholder do mesmo tamanho) até montar no client
- Ícone: `Sun` quando tema atual é dark (ação = ir pra light), `Moon` quando é light (ação = ir pra dark) — lucide-react, já é dependência
- `onClick` → `setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')`
- Estilo consistente com `FavoritesDrawer` (botão ghost, ícone + hover de cor)

## Posicionamento
`frontend/src/components/HomeClient.tsx`, dentro do `<nav>` do header, ao lado do `FavoritesDrawer`:
```tsx
<nav className="flex items-center gap-6">
  <ThemeToggle />
  <FavoritesDrawer onSelectQuote={handleSelectFavorite} />
</nav>
```

## Cleanup — CSS vars mortas
`frontend/src/app/globals.css` define `--background`/`--foreground` em `:root` e `.dark`, mas nenhum elemento usa essas variáveis (body usa classes Tailwind diretas `bg-parchment-50 text-stone-800`). Remover esse bloco morto — a passada de dark mode abaixo usa `dark:` utilities do Tailwind diretamente, mantendo um único sistema de estilo.

## Passada visual `dark:` (paleta stone invertida)
Paleta base: fundo `stone-900`/`stone-800`, texto `stone-100`/`stone-300`, bordas `stone-700`, mantendo a identidade serifada/parchment no light mode intacta.

- **`globals.css`**
  - `body`: `dark:bg-stone-900 dark:text-stone-100`
  - `.quote-text`: `dark:text-stone-100`
  - `.reflection-text`: `dark:text-stone-300`
  - `.author-text`: `dark:text-stone-500`
  - `.category-badge`: `dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700`

- **`HomeClient.tsx`**
  - Título do header (`h1`): `dark:text-stone-200` / subtítulo `dark:text-stone-500`
  - Card container: `dark:bg-stone-800/70 dark:border-stone-700 dark:shadow-none`
  - Footer: `dark:text-stone-600` / `dark:text-stone-700`

- **`QuoteCard.tsx`**
  - Linhas do ornamento e divider: `dark:bg-stone-700`
  - Aspas decorativas: `dark:text-stone-700`
  - Tags: `dark:border-stone-700 dark:text-stone-500`
  - Botão "Nova reflexão" (primário, invertido): `dark:bg-parchment-100 dark:text-stone-900 dark:hover:bg-parchment-200`
  - Botões circulares (favoritar/copiar/compartilhar): `dark:border-stone-700 dark:text-stone-500`, mantendo cores de estado (rose/green) com variantes `dark:bg-*-950 dark:border-*-800 dark:text-*-300` quando ativos

- **`FavoritesDrawer.tsx`**
  - Botão "Favoritos": `dark:text-stone-500 dark:hover:text-stone-300`
  - Badge contador: `dark:bg-rose-950 dark:text-rose-300`
  - Overlay: mantém (já é escuro/translúcido)
  - Drawer aside: `dark:bg-stone-900 dark:border-stone-700`
  - Header do drawer (borda, botão fechar): `dark:border-stone-700 dark:hover:bg-stone-800`
  - Empty state (ícone/texto): `dark:text-stone-700` / `dark:text-stone-500`
  - Itens da lista: `dark:border-stone-700 dark:bg-stone-800/60 dark:hover:border-stone-600`, textos `dark:text-stone-300` / `dark:text-stone-500`

- **`DailyBadge.tsx`**
  - Texto: `dark:text-stone-500`

## Fora de escopo
- `QuoteSection.tsx` (componente não utilizado pela home atual) — não tocado.

## Teste manual
1. `npm run dev` no frontend
2. Verificar tema inicial reflete `prefers-color-scheme` do OS/browser
3. Clicar no toggle → tema muda instantaneamente em toda a UI (header, card, drawer de favoritos, footer), sem flash
4. Recarregar a página → tema escolhido persiste
5. Abrir drawer de favoritos em dark mode → verificar contraste/legibilidade
