const Request = require('../../request')
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
 	await Request.ajax('gettoken',COMMON.product[ctx.query.type]).then((res) => {
  	ctx.state.token = res.data.token;
  	return next();
  })
}