const constant = require('../global/constant');
module.exports = async (ctx, next) => {
	
	ctx.state.mock = ctx.query.mock;
	ctx.state.fail = [];
	ctx.state.response = constant.response.success;
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	try {
    await next();
  } catch (err) {
    ctx.state.response = constant.response.nodeerror;
  }
	let fail = ctx.state.fail;
	let responseData = {};
	if(fail && fail.length){
		for(let i=0;i<fail.length;i++){
			if(fail[i].state == "error"){
				if(fail[i].msg == "nologin"){
					responseData = constant.response.nologin;
				}else{
					responseData = constant.response.error;
				}
			}
		}
	}else{
		for(let i in ctx.state.response){
			responseData[i] = ctx.state.response[i];
		}
		if(ctx.state.data){
			for(let i in ctx.state.data){
				responseData[i] = ctx.state.data[i];
			}
		}
	}
	
	ctx.body = responseData;
}