
const router = require('koa-router')();
const compose = require('koa-compose');

const api = require('./api');

function addMapping() {
	api.forEach( (item, index) => {
		if(item.type == "get"){
			let methods = [];
			item.modules.forEach( (list, index) => {
				methods.push(require(`${__dirname}/${list}`))
			})
			router.get(`/api/userAction/scene/mobileIndex/${item.path}`, compose(methods));
		}
	})
}

module.exports = () => {
	addMapping()
  return router.routes();
};
