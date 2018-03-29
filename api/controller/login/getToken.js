const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
	// ctx.state.mock = true;
	await Request.ajax({
		server : 'gettoken',
		ctxState : ctx.state,
		data : COMMON.product[ctx.request.body.type]
	}).then((res) => {
  	ctx.state.token = res.data.token;
  	return next();
  })
}
