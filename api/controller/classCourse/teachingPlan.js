const Request = require('../../request');

module.exports = async(ctx, next) => {
	ctx.state.mock = true;
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