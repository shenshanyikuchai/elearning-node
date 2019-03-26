
const router = require('koa-router')();
const compose = require('koa-compose');

const api = require('./api');

function addMapping() {
	api.forEach( (item, index) => {
<<<<<<< HEAD
		let methods = [];
		if(item.type != "html"){
			methods.push(require(`${__dirname}/../controller/index`))
		}
=======
		let methods = [require(`${__dirname}/../controller/index`)];
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
		item.modules.forEach( (list, index) => {
			// methods.push(require(`${process.cwd()}/api/controller/${list}`))
			methods.push(require(`${__dirname}/../controller/${list}`));
		});
<<<<<<< HEAD
		if(item.type == "html"){
			router.get(`/${item.path}`, compose(methods));
		}else if(item.type == "get"){
=======
		if(item.type == "get"){
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
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