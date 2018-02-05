const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaBodyparser = require('koa-bodyparser');
const router = require('./router/config');
const app = new Koa();

app.use(cors());
app.use(koaBodyparser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3080);
