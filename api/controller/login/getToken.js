const Request = require('../../request');
module.exports = async (ctx, next) => {
	// ctx.state.mock = true;
	console.log('getToken', ctx.request)
	if(ctx.query.type && ctx.query.username && ctx.query.password){
			await Request.ajax({
				server : 'gettoken',
				ctxState : ctx.state,
				data : ZBG.COMMON.product[ctx.query.type]
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
