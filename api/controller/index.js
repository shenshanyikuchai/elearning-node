const constant = require('../global/constant');
// const platform = require('platform');
module.exports = async (ctx, next) => {

	ctx.state.mock = ctx.query.mock || ctx.request.body.mock;
	// ctx.state.mock = true;
	ctx.state.fail = [];
	ctx.state.response = constant.response.success;
	// const UA = platform.parse(ctx.request.header['user-agent']);
	// ctx.state.UA = UA;

  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	try {
		console.log(1)
    await next();
    console.log(2)
  } catch (err) {
  	console.log(err)
    ctx.state.response = constant.response.nodeerror;
  }
 	console.log(3)
	let fail = ctx.state.fail;
	let responseData = {};
	if(fail && fail.length){
		for(let i=0;i<fail.length;i++){
			if(fail[i].state == "error"){

				if(fail[i].msg == "nologin"){
					
				}else if(fail[i].msg == "用户名或密码错误"){
					responseData = constant.response.errorInput;
				}else{
					responseData = constant.response.error;
				}
			}else{
				responseData = constant.response.error
			}
		}
	}else{
		for(let i in ctx.state.response){
			responseData[i] = ctx.state.response[i];
		}
		console.log(ctx.state.data)
		if(ctx.state.data){
			for(let i in ctx.state.data){
				responseData[i] = ctx.state.data[i];
			}
		}
	}
	ctx.body = responseData;
}