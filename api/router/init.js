
const router = require('koa-router')();
const compose = require('koa-compose');

const api = require('./api');

function addMapping() {
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
			router.get(`/${item.path}`, compose(methods));
		}else if(item.type == "post"){
			router.post(`/${item.path}`, compose(methods));
		}
	});
}

module.exports = {
	routes : () => {
		addMapping();
		router.prefix('/api/userAction/scene/mobileIndex')
	  return router.routes();
	},
	allowedMethods : () => {
		return router.allowedMethods();
	}
};