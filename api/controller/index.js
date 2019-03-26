<<<<<<< HEAD
module.exports = async (ctx, next) => {
	// debugger;
=======
const constant = require('../global/constant');
// const platform = require('platform');
module.exports = async (ctx, next) => {
	ctx.state.mock = ctx.query.mock;
	ctx.state.fail = [];
	ctx.state.response = constant.response.success;
	// const UA = platform.parse(ctx.request.header['user-agent']);
	// ctx.state.UA = UA;

  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	try {
    await next();
  } catch (err) {
    ctx.state.response = constant.response.nodeerror;
  }
 
	let fail = ctx.state.fail;
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
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
<<<<<<< HEAD
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
=======
	ctx.body = responseData;
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
}