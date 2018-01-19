const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
	await Request.ajax({
		server : 'gettoken',
		mock : ctx.state.mock,
		data : COMMON.product[ctx.query.type]
	}).then((res) => {
  	ctx.state.token = res.data.token;
  	return next();
  })
}
