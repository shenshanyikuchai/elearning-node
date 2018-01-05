module.exports = async (ctx, next) => {
	ctx.state.mock = ctx.query.mock;
	ctx.state.fail = [];
	ctx.state.code = "200";
	ctx.state.msg = "成功";
	ctx.state.state = "success";
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	await next();
	
	let fail = ctx.state.fail;
	if(fail && fail.length){
		for(var i=0;i<fail.length;i++){
			if(fail[i].state == "error"){
				if(fail[i].msg == "nologin"){
					ctx.state.code = "333";
					ctx.state.msg = "没有登录";
					ctx.state.state = "nologin";
				}else{
					ctx.state.code = "444";
					ctx.state.msg = "服务器错误";
					ctx.state.state = "error";
				}
			}
		}
	}
	let bodyData = {
		code : ctx.state.code,
		msg : ctx.state.msg,
		state : ctx.state.state
	}
	if(ctx.state.response){
		for(var i in ctx.state.response){
			bodyData[i] = ctx.state.response[i];
		}
	}
	ctx.body = bodyData;
}