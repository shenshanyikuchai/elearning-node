const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaBodyparser = require('koa-bodyparser');
// const platform = require('platform');
const userAgent = require('koa2-useragent');
const app = new Koa();
const { resolve, join } = require('path')
const path = require('path');
// 基础配置
const config = require('./config');
const configDemo = require('./config/demo');
const templating = require('./init/templating');

const isProduction = process.env.NODE_ENV === 'production';
console.log('NODE_ENV', process.env.NODE_ENV)

app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	var
			start = new Date().getTime(),
			execTime;
	await next();
	execTime = new Date().getTime() - start;
	ctx.response.set('X-Response-Time', `${execTime}ms`);
});

if (!isProduction) {
	const staticFiles = require(`${__dirname}/init/static.js`);
	app.use(staticFiles('/static/', __dirname + '/static'));

	
}

app.use(koaBodyparser());

// process.env.NODE_ENV = "demo";
console.log(process.env.NODE_ENV)

// app.use(templating('views', {
//     noCache: !isProduction,
//     watch: !isProduction
// }));

app.use(templating({
  debug: true,
  ext: 'html',
  path: resolve(join(__dirname, 'views')),
  njConfig: {
    watch: true
  }
}))


if(process.env.NODE_ENV == "demo" || process.env.NODE_ENV == "dev"){
	app.context.config = configDemo;
}else{
	app.context.config = config;
}
// process.env.NODE_ENV = app.context.config.NODE_ENV

// 全局方法
const iGlobal = require('./global');
app.context.iGlobal = iGlobal;
// 全局静态变量
const constant = require('./global/constant');
app.context.constant = constant;
// 请求
const Request = require('./request');
app.context.Request = Request;
// 业务逻辑
const Filter = require('./filter');
app.context.Filter = Filter;
// 数据库业务逻辑
const DB = require('./db');
app.context.DB = DB;


// 是否启用数据库
if(app.context.config.isDb){
	// 连接数据库
	const Monk = require('monk');
	app.context.dbs = Monk(app.context.config.dbs);
}

// 初始化路由
const router = require('./router/init');
app.use(userAgent());
app.use(cors());

// 初始化返回数据
app.context.responseData = {};
global.ZBG = {
	...app.context.config,
	prefix: '/api/userAction/scene/mobileIndex/',
	api: router.api,
	// platform : platform,
	callMeTime : 60*60*1000, // 接收时间间隔
	requestError : [], // 接口报错发送短信列表
	earlyWarning: [], // 消息预警
	iGlobal : iGlobal,
	COMMON : constant,
	Request : Request,
	Filter : Filter,
	DB : DB
};
app.use(router.apiRouters()).use(router.allowedMethods());

if(process.env.NODE_ENV == "demo" || process.env.NODE_ENV == "dev"){
	app.listen(3088);
}else{
	app.listen(3080);
}
// app.listen(3080);
