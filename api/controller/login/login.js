const Request = require('../../request')
const constant = require('../../global/constant');
module.exports = async(ctx) => {
	await Request.ajax({
		server : 'login',
		ctxState : ctx.state,
		data : {
	    token: ctx.state.token,
	    account: ctx.request.body.username,
	    password: ctx.request.body.password
	  }
	}).then((res) => {
		res.data.type = "";
		for(let userlevel of constant.userLevel){
			if(userlevel.id == res.data.userLevel){
				res.data.type = userlevel.type;
				break;
			}
		}
    ctx.state.data = res;
  })
}