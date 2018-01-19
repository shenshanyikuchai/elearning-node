const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
	  server : 'memberGetplan',
	  ctxState : ctx.state,
	  data : {
	    token: ctx.query.token,
	    courseCategoryId: ctx.state.courseDetail.subjectId,
	    courseId: ctx.query.courseId
	  }
	}).then((res) => {
	  ctx.state.memberGetplan = res.data;
	  return next();
	})
}