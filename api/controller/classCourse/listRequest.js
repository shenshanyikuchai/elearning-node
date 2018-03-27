const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
		server : "classCourseList",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token
		}
	}).then((res) => {
		console.log(res)
		ctx.state.classCourseList = res;
		return next();
	})
}