const Request = require('../../request')
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
	console.log(COMMON.product[ctx.query.type])
 	await Request.ajax('gettoken',COMMON.product[ctx.query.type]).then((res) => {
 		console.log(res)
  	ctx.state.token = res.data.token;
  	return next();
  })
}