# 0x0G

An AI playground [https://0x0g.alanjin.me/](https://0x0g.alanjin.me/)

![screenshot](https://static.alanjin.me/photos/projects/2023-04-04_21-29_1.png)

## Setup
```
pnpm i
pnpm dev
```
and you are ready to go!

### Setup for Vector DB & Embedder
As ChromaDB does not have access control yet, the project require user to have a custom endpoint (in my case, a tiny koa.js function) to handel DB request.

```js
router.post("/chromadb", async (ctx, next) => {
  const apiKey = ctx.request.body.apiKey
  const text = ctx.request.body.text
  const collectionName = ctx.request.body.collectionName
  const numberOfResults = ctx.request.body.numberOfResults
  const joinBy = decodeURIComponent(ctx.request.body.joinBy);
  ...
  ctx.body = "plain string";
});

```