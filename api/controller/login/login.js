const Request = require('../../request')
const constant = require('../../global/constant');
module.exports = async (ctx) => {
	await Request.ajax({
<<<<<<< HEAD
		server: 'login',
		ctxState: ctx.state,
		data: {
			token: ctx.state.token,
			account: ctx.request.body.username,
			password: ctx.request.body.password
		}
	}).then((res) => {
		if (res.state == "success") {
			res.data.type = "";
			for (let userlevel of constant.userLevel) {
				if (userlevel.id == res.data.userLevel) {
					res.data.type = userlevel.type;
					break;
				}
			}
			ctx.state.data = res;
		} else {

		}

	})
=======
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
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
}