const Request = require('../../request');
module.exports = async (ctx, next) => {
<<<<<<< HEAD
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
	
=======
	await Request.ajax({
		server : 'gettoken',
		ctxState : ctx.state,
		data : COMMON.product[ctx.request.body.type]
	}).then((res) => {
  	ctx.state.token = res.data.token;
  	return next();
  })
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
}
