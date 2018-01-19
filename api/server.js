// const sys = require('sys');

const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

// const api = require('./request/api');

const router = require('./router/config');

const app = new Koa();
app.use(cors());

app.use(router());
 
app.listen(3080);
