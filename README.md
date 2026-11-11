# Portfólio — Vitor Alexandre Garcia Vaz

Portfólio pessoal em **React + TypeScript + Vite**, publicado no GitHub Pages:
**https://xandgvaz.github.io/Portifolio/**

## Desenvolvimento

```bash
npm install
npm run dev       # servidor local em http://localhost:5173/Portifolio/
npm run build     # typecheck + build de produção em dist/
npm run preview   # serve o dist/ localmente
```

## Editando o conteúdo

Todo o texto (PT e EN), projetos, experiências, prêmios e tecnologias ficam em
[`src/content.ts`](src/content.ts). Para adicionar um projeto, acrescente um item ao
array `projects`; o link do repositório (`repo`) é opcional — sem ele, o card mostra
"Código privado".

## Deploy

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) faz o build e
publica no GitHub Pages a cada push na `main`. Em *Settings → Pages*, a fonte deve estar
como **GitHub Actions**.

> Se o repositório for renomeado, atualize o `base` em [`vite.config.ts`](vite.config.ts).
