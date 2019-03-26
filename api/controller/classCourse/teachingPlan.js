const Request = require('../../request');

module.exports = async(ctx, next) => {
<<<<<<< HEAD
=======
	ctx.state.mock = true;
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
	await Request.ajax({
		server : "teachingPlan",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token,
  		memberId: ctx.query.memberId,
  		courseId: ctx.query.courseId
		}
	}).then((res) => {
		ctx.state.data = res;
		return next();
	})
}