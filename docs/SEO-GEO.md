# SEO e GEO: publicação, manutenção e medição

Os títulos, descrições, H1 das calculadoras, URLs originais, meta keywords e listas de palavras-chave dos artigos são protegidos pelo teste de regressão. Não altere esses campos para resolver problemas de renderização.

## O que o build entrega

- 27 páginas com conteúdo próprio no HTML inicial, incluindo os quatro artigos completos e as páginas institucionais. O cálculo interativo continua exigindo JavaScript.
- Um grafo JSON-LD compartilhado pelo HTML inicial e pelo navegador: Organization, WebSite, página, Article ou WebApplication quando aplicável e BreadcrumbList. Sem pessoas, credenciais ou avaliações inventadas.
- Respostas resumidas, exemplos, premissas, fontes oficiais e links de assuntos relacionados. O conteúdo fiscal identifica o ano de 2026.
- `sitemap.xml`, `llms.txt` e `llms-full.txt` gerados a partir das páginas. Os arquivos públicos são snapshots verificados, não uma fonte independente de regras.
- Redirecionamentos permanentes dos aliases antigos para os caminhos originais, tanto no preview quanto nas configurações `_redirects` e Vercel. A integração real depende da hospedagem usar a configuração correspondente.

## Antes de publicar

1. Execute `npm ci` e `npm run verify`. Os testes de conteúdo não exigem JavaScript no navegador; `check:seo` confere os arquivos finais, não somente os componentes.
2. Ao mudar conteúdo, atualize explicitamente `CONTENT_UPDATED` em `src/utils/editorial.ts`. A revisão registrada em 2026-10-04 inclui a correção do conteúdo inicial e dos dados estruturados. Não use a data de cada build como atualização editorial.
3. Execute `npm run build` e atualize `public/llms.txt`, `public/llms-full.txt` e `public/sitemap.xml` com os respectivos arquivos de `dist`; execute novamente `npm run verify`.
4. Não invente `datePublished`: a data de primeira publicação não foi comprovada. Caso seja documentada depois, registre-a separadamente da revisão do conteúdo e mostre-a na página.
5. Revise a norma, categoria, vigência e acordo aplicáveis antes de atualizar exemplos fiscais ou trabalhistas. Os testes numéricos não equivalem a revisão profissional de todos os casos.

## Depois de publicar

Execute `npm run check:live` para o domínio oficial ou `npm run check:live -- https://dominio-de-preview.example`. O comando é somente leitura e confere 27 respostas HTTP, corpo dos artigos, canonical, indexabilidade, arquivos de descoberta, redirecionamentos e erro 404. Não confirma que mecanismos de busca já indexaram o site.

No Search Console, use a propriedade do domínio correto, envie `/sitemap.xml` e inspecione ao menos a página inicial, um artigo e um simulador fiscal. Confira o HTML recebido, a canonical escolhida pelo Google e os motivos de exclusão. Já existe uma meta de verificação no projeto; ela foi preservada, mas a titularidade da propriedade não foi confirmada.

No Bing Webmaster Tools, verifique a propriedade e envie o mesmo sitemap. Use relatórios de indexação e de visibilidade em IA quando disponíveis na conta. Não marque tarefas externas como concluídas sem acesso ao relatório.

Confira nos logs da hospedagem se Googlebot, Bingbot e OAI-SearchBot recebem páginas e recursos com sucesso, sem bloqueio de CDN. Valide IPs com a documentação do fornecedor antes de liberar exceções; user-agent isolado não comprova identidade. `User-agent: * / Allow: /` já permite OAI-SearchBot. GPTBot é separado e sua permissão não determina elegibilidade no ChatGPT Search.

## Medição, sem dados inventados

Registre semanalmente: período, página canônica, consulta, impressões, cliques, CTR, posição e estado de indexação no Search Console. Separe consultas de marca das demais e compare janelas equivalentes, anotando a data de implantação. O tráfego de AI Overviews/AI Mode é incluído no tipo Web do Search Console; não atribua todo o aumento a IA.

Em uma ferramenta de estatísticas já autorizada, compare páginas de entrada e referências de fontes de IA quando presentes. Referências ausentes não provam ausência de visitas de IA. Para eventos de cálculo concluído e exportação concluída, defina primeiro o que constitui sucesso; não confunda clique em exportar com arquivo salvo. Não envie nomes, salários, horários, e-mails ou conteúdo de formulário para estatísticas. Qualquer integração de terceiros exige respeitar a preferência de cookies e atualizar a política quando necessário.

Para desempenho, consulte PageSpeed Insights e dados de campo do Search Console/CrUX. Metas recomendadas no percentil 75: LCP até 2,5 s, INP até 200 ms e CLS até 0,1. Faça também medições de laboratório em celular, mas não apresente o resultado local como experiência real dos visitantes. Se não houver amostra suficiente, registre “dados insuficientes”.

Os módulos de artigos deixam de ser montados automaticamente em todas as calculadoras; os links relacionados permitem chegar ao guia. O service worker pré-carrega apenas os arquivos JavaScript/CSS das calculadoras e páginas de maior uso; outras páginas são guardadas após visita. O uso offline depende de armazenamento disponível e não deve ser anunciado como universal.

## Referências primárias

- [Google: recursos de IA e seu site](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Article](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: sitemap e lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [OpenAI: crawlers](https://developers.openai.com/api/docs/bots)

Arquivos de IA e dados estruturados não garantem classificação, indexação ou citação. Priorize texto acessível, consistência das regras, fontes e utilidade para o leitor.
