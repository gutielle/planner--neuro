# Landing Pages — [Planner Neuro]

Colecao de landing pages estaticas em HTML, CSS e JS, pronta para deploy na Vercel sem etapa de build.

## Estrutura do projeto

```text
.
├── index.html                               # Pagina raiz publicada pela Vercel
├── oferta01-before-after-bridge.html
├── oferta01-before-after-bridge-v2.html
├── oferta01-star-story-solution.html
├── oferta02-pas.html
├── oferta03-lead.html
├── oferta03-manifesto.html
├── assets/
│   ├── css/
│   │   ├── before-after-bridge.css
│   │   ├── before-after-bridge-v2.css
│   │   ├── oferta02-pas.css
│   │   ├── oferta03-lead.css
│   │   ├── oferta03-manifesto.css
│   │   └── star-story-solution-v1.css
│   └── js/
│       ├── before-after-bridge.js
│       ├── before-after-bridge-v2.js
│       ├── oferta02-pas.js
│       ├── oferta03-lead.js
│       ├── oferta03-manifesto.js
│       └── star-story-solution.js
├── outputs/
│   └── index.html                           # Atalho para a pagina principal
├── vercel.json
├── .gitignore
└── README.md
```

## Paginas disponiveis

- `index.html` -> Oferta01 Before-After-Bridge
- `oferta01-before-after-bridge.html`
- `oferta01-before-after-bridge-v2.html`
- `oferta01-star-story-solution.html`
- `oferta02-pas.html`
- `oferta03-lead.html`
- `oferta03-manifesto.html`

## Edicao

- Estrutura e copy: edite o arquivo `.html` da pagina desejada
- Estilo: edite o arquivo correspondente em `assets/css/`
- Interacoes: edite o arquivo correspondente em `assets/js/`

Cada landing page usa seus proprios arquivos de CSS e JS para evitar impacto nas outras versoes.

## Antes de publicar

Os placeholders foram mantidos intencionalmente no projeto. Antes de publicar em producao, revise e substitua o que for necessario:

- `[NOME DA MARCA]`
- `[LINK DE CHECKOUT]`
- `[SEU NOME]` na pagina `oferta01-star-story-solution.html`
- Depoimentos marcados como exemplo ilustrativo

## Deploy na Vercel

1. Suba esta pasta para um repositorio proprio no GitHub.
2. Na Vercel, clique em **Add New -> Project**.
3. Importe o repositorio.
4. Use o preset `Other`.
5. Deixe **Build Command** e **Output Directory** em branco.
6. Clique em **Deploy**.

A Vercel vai publicar `index.html` na raiz. Se quiser que outra landing seja a principal do dominio, troque o arquivo raiz `index.html` ou configure um redirecionamento depois.

## Visualizacao local

Abra qualquer arquivo `.html` direto no navegador ou sirva a pasta com um servidor estatico simples.
