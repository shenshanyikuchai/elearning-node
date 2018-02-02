// const sys = require('sys');


const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaBodyparser = require('koa-bodyparser');
const router = require('./router/config');
// const router = require('koa-router')();
const app = new Koa();
app.use(cors());
app.use(koaBodyparser());
app.use(router());
// app
// .use(router.routes())
// .use(router.allowedMethods());
// router.post('/a', async function(ctx, next) {
//   console.log(JSON.stringify(ctx.request));
//   ctx.body = "{state:'success',data:[],msg:'success'}"
// })
app.listen(3080);
