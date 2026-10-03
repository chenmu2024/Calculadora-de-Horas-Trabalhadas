# Calculadora de Horas Trabalhadas

Site React/Vite com calculadoras trabalhistas brasileiras. Os títulos, descrições, H1, palavras-chave e URLs existentes são protegidos por um teste de comparação com a versão anterior à correção.

## Desenvolvimento e verificação

```sh
npm ci
npm run dev
npm run verify
npm run preview
```

`verify` executa tipos, regressões e produção. `preview` serve `dist` em http://127.0.0.1:4173 com respostas 404 reais. Não use os antigos scripts `fix_*.js` ou `test-prod*.js` como processo de build; são históricos, não fazem parte da aplicação.

## Publicação

Use `npm run build` e publique **dist**, incluindo os diretórios pré-renderizados, `404.html`, `_redirects`, `sitemap.xml` e `sw.js`. O build gera as regras explícitas para Netlify/Cloudflare Pages e a configuração de Vercel. Não configure um fallback global `/* → /index.html 200`: ele perde os metadados individuais e recria soft 404. Em outro servidor estático, sirva os `index.html` de cada diretório e devolva `404.html` com status 404 para caminhos ausentes. Preserve as URLs públicas existentes.

O build pré-renderiza os 23 caminhos existentes e quatro artigos com seus títulos atuais. Os cálculos e dados pessoais continuam no navegador. O worker pré-carrega HTML e todos os pacotes estáticos; uma atualização espera as abas antigas fecharem para evitar misturar versões. O build deve falhar se qualquer página ou recurso necessário não puder ser gerado.

## Regras e limites dos cálculos

- INSS 2026: [eSocial / Portaria MPS-MF 13/2026](https://www.gov.br/esocial/pt-br/noticias/liberado-o-envio-de-eventos-de-folha-para-o-esocial-apos-publicacao-de-portaria-que-reajusta-valores-previdenciarios-em-2026-1).
- IRRF 2026: [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026). `calculateIRRF` recebe renda tributável **antes** do INSS. Desconto simplificado substitui deduções legais; redução de 2026 usa a renda tributável bruta. Múltiplas fontes e ajuste anual não são simulados.
- Seguro-desemprego: [MTE 2026](https://agenciagov.ebc.com.br/noticias/202601/mte-reajusta-valores-do-beneficio-seguro-desemprego). Valor por média salarial; elegibilidade exige condições e janelas legais, informadas na interface.
- CLT: [texto oficial](https://planalto.gov.br/ccivil_03/decreto-lei/del5452.htm). Acordos coletivos e condições específicas precisam ser conferidos. Escala 12x36 não adiciona feriados ou prorrogação automaticamente. A tolerância do banco exige confirmação do limite por batida. Na rescisão, os avos informados devem incluir a projeção do aviso, e férias vencidas representam um período simples.

As tabelas financeiras estão em `src/utils/taxCalculations.ts`; atualize os testes e as referências quando mudar o ano. As planilhas XLSX contêm fórmulas de horas, saldo e valor; o CSV contém valores estáticos e escapa conteúdo do usuário. Não há coleta do e-mail opcional de download.

## Contato e privacidade

O formulário abre um rascunho no aplicativo de e-mail para o endereço já informado pelo site; não afirma que o e-mail foi enviado nem garante prazo de resposta. Um backend de envio não está configurado. Os registros antigos de histórico são lidos sem apagar dados; falhas de armazenamento/clipboard são informadas na tela. As preferências de cookies podem ser reabertas no rodapé. Não há publicidade ou análise de terceiros ativa no aplicativo.

## Atualizações de 04/10/2026

- As planilhas usam P por linha para o adicional HE (0.5 / 1) e Q para descanso (1 / 0). Não inferem feriados pela descrição. M2 representa a meta em horas reais; ajuste conforme a jornada e o acordo. O modelo noturno oferece confirmação de prorrogação (O2 = 1), apenas para jornada cobrindo integralmente 22–05 e descontando pausas. As fórmulas calculam o adicional HE, hora reduzida e integração dos adicionais, com totais e valores editáveis.
- O assistente de rescisão recebe explicitamente o início dos períodos de 13º e férias não quitados/gozados. Mostra projeção e 13º por ano, conta férias por aniversário e separa períodos completos simples/em dobro. Férias parcialmente gozadas, pagamentos anteriores, suspensões e condições especiais devem ser ajustados pelos registros; não são inferidos. Não reutilize o modo manual após aplicar as datas sem conferir os períodos de férias.
- Dados inválidos de divisor, horas faturáveis ou alíquota impedem resultados, cópia, exportação e impressão. A exportação da comparação CLT/PJ usa o resultado da comparação.
- GitHub Actions executa instalação pelo lockfile, tipos, regressões e build em PRs e alterações na main; não publica o site.
