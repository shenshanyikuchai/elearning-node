const Request = require('../../request');
module.exports = async (ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.request.body.type && ctx.request.body.username && ctx.request.body.password){
			await Request.ajax({
				server : 'gettoken',
				ctxState : ctx.state,
				data : ZBG.COMMON.product[ctx.request.body.type]
			}).then((res) => {
				if(res.state == "success"){
					ctx.state.token = res.data.token;
					return next();
				}
		  	
		  })
	}else{
		ctx.state.response = ZBG.COMMON.response.noparameter;
	}
	
}
