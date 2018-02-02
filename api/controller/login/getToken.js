const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
	console.log(ctx)
	
	await Request.ajax({
		server : 'gettoken',
		ctxState : ctx.state,
		data : COMMON.product[ctx.query.type]
	}).then((res) => {
  	ctx.state.token = res.data.token;
  	return next();
  })
}
