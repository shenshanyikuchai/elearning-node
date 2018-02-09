const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaBodyparser = require('koa-bodyparser');

const app = new Koa();
const router = require('./router/init');

app.use(cors());
app.use(koaBodyparser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3080);
console.log("http://localhost:3080/api/userAction/scene/mobileIndex/login")
