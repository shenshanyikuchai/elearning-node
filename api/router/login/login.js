const Request = require('../../request')

module.exports = async(ctx) => {
	await Request.ajax({
		server : 'login',
		mock : ctx.state.mock,
		data : {
	    token: ctx.state.token,
	    account: ctx.query.username,
	    password: ctx.query.password
	  }
	}).then((res) => {
    ctx.body = res
  })
}