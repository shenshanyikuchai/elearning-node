const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
	  server : 'searchCourseAlterationsByVersionId',
	  ctxState : ctx.state,
	  data : {
  		versionId: ctx.state.courseDetail.versionId
  	}
	}).then((res) => {
	  ctx.state.searchCourseAlterationsByVersionId = res.data;
	  return next();
	})
  
}