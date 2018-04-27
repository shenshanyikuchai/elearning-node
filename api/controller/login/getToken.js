const Request = require('../../request');
const COMMON = require('../../global/constant');

module.exports = async (ctx, next) => {
	ctx.state.mock = true;
	if(ctx.request.body.type && ctx.request.body.username && ctx.request.body.password){
			await Request.ajax({
				server : 'gettoken',
				ctxState : ctx.state,
				data : COMMON.product[ctx.request.body.type]
			}).then((res) => {
		  	ctx.state.token = res.data.token;
		  	return next();
		  })
	}else{
		ctx.state.response = COMMON.response.noparameter;
	}
	
}
