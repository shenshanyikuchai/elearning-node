module.exports = async (ctx, next) => {
	// debugger;
	let responseData = {};
	ctx.state = {
		newTime : new Date().getTime(),
		mock : ctx.query.mock || false,
		fail : [],
		response : ctx.constant.response.success,
		UAType : ctx.Filter.getCoursePlanDetailType(ctx)
	};


	console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	try {
		await next();
	} catch (err) {
		console.log(err)
		ctx.state.response = ctx.constant.response.nodeerror;
	}
	if (ctx.state.fail && ctx.state.fail.length) {
		responseData = ZBG.iGlobal.filterFail(ctx.state.fail);
	} else {
		if(ctx.state.response.code == "200"){
			responseData = {
				...ctx.state.data,
				...ctx.state.response
			};
		}else{
			responseData = ctx.state.response;
		}
	}
	// 开启短信/邮箱预警
	if(ZBG.isSendErrorSms){
		ZBG.iGlobal.isCallMe(responseData);
	}
	
	if(responseData.isWxGetToken){
		ctx.body = responseData.echostr;
	}else{
		ctx.body = responseData;
	}
	if(ZBG.isDb){
		ctx.DB.logs(ctx);
	}
	ctx.state = {};
}