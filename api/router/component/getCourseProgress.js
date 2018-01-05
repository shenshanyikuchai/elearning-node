const Request = require('../../request');

module.exports = async(ctx, next) => {
	if(ctx.state.courseIds && ctx.state.courseIds.length){
		await Request.ajax({
		  server : 'getCourseProgress',
		  ctxState : ctx.state,
		  data : {
		    token: ctx.query.token,
		    memberId: ctx.query.memberId,
		    courseId: ctx.state.courseIds
		  }
		}).then((res) => {
		  ctx.state.getCourseProgress = res;
		  return next();
		})
	}
  
}