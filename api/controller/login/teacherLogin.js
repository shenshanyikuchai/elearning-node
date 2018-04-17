const Request = require('../../request')

module.exports = async(ctx) => {
	// ctx.state.mock = true;
	await Request.ajax({
		server : 'teacherLogin',
		ctxState : ctx.state,
		data : {
	    token: ctx.state.token,
	    account: ctx.request.body.username,
	    password: ctx.request.body.password
	  }
	}).then((res) => {
    ctx.state.data = res;
  })
}