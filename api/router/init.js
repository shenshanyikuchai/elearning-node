
const router = require('koa-router')();
const compose = require('koa-compose');

const html = require('./html');
const api = require('./api');
const nunjucks = require('nunjucks');


function addMapping() {
	router.get(`/`, async (ctx, next) => {
		ctx.render(require(`${__dirname}/../views/index.html`), {
				title: 'Welcome'
		})});
}

function addHtmlMapping() {
	html.forEach( (item, index) => {
		let methods = [];
		methods.push(require(`${__dirname}/../html/${item.path}`));
		router.get(`/${item.path}`, compose(methods));
	});
}

function addApiMapping() {
	api.forEach( (item, index) => {
		let methods = [];
		if(item.type != "html"){
			methods.push(require(`${__dirname}/../controller/index`))
		}
		item.modules.forEach( (list, index) => {
			// methods.push(require(`${process.cwd()}/api/controller/${list}`))
			methods.push(require(`${__dirname}/../controller/${list}`));
		});
		if(item.type == "html"){
			router.get(`/${item.path}`, compose(methods));
		}else if(item.type == "get"){
			router.get(`/api/userAction/scene/mobileIndex/${item.path}`, compose(methods));
		}else if(item.type == "post"){
			router.post(`/api/userAction/scene/mobileIndex/${item.path}`, compose(methods));
		}
	});
}

module.exports = {
	apiRouters : () => {
		addMapping();
		addHtmlMapping();
		addApiMapping();
	  return router.routes();
	},
	allowedMethods : () => {
		return router.allowedMethods();
	}
};