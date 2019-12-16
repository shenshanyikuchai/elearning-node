const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaBodyparser = require('koa-bodyparser');
// const platform = require('platform');
const userAgent = require('koa2-useragent');
const app = new Koa();


// 基础配置
const config = require('./config');
const configDemo = require('./config/demo');

// process.env.NODE_ENV = "demo";
console.log(process.env.NODE_ENV)
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

// 初始化返回数据
app.context.responseData = {};
global.ZBG = {
	...app.context.config,
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
// 初始化路由
const router = require('./router/init');
app.use(userAgent());
app.use(cors());
app.use(koaBodyparser());
app.use(router.routes()).use(router.allowedMethods());

if(process.env.NODE_ENV == "demo" || process.env.NODE_ENV == "dev"){
	app.listen(3088);
}else{
	app.listen(3080);
}
// app.listen(3080);
