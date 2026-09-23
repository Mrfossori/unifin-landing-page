# UNIFIN — Landing page de validação

Landing page acadêmica para validar o interesse de universitários no UNIFIN, uma proposta de organização financeira voltada à rotina de graduação.

## Stack

- Next.js/Vinext, React, TypeScript e Tailwind CSS
- Cloudflare D1 com Drizzle ORM
- OpenAI Sites para hospedagem

## Rodar localmente

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run db:generate
npm run build
npm run dev
```

Para testar os endpoints localmente, aplique a migração criada em `drizzle/` conforme as instruções do starter Sites e use o banco D1 local do Wrangler.

## Leads e acessos

Os leads ficam na tabela `unifin_leads`. As visualizações ficam em `unifin_page_views`. O banco é acessado somente pelas rotas do servidor; não existe endpoint público para listar, editar ou excluir os registros.

O responsável pelo projeto consulta os resultados em `/admin`, usando a senha armazenada como segredo `ADMIN_PASSWORD` no Sites. O painel mostra leads reais, acessos, conversão, testes e permite exportar CSV. Registros com `is_test = 1` são testes técnicos e não entram na conversão.

## Novo deploy

Faça as alterações, gere uma nova migração quando o schema mudar, execute `npm run lint` e `npm run build`, envie o commit ao GitHub e publique uma nova versão pelo fluxo do Sites.

Nenhuma chave privada ou segredo é necessário no frontend.
