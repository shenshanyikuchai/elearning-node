const Request = require('../../request')

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
    ctx.state.data = res
  })
}