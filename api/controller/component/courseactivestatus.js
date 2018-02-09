const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
	  server : 'courseactivestatus',
	  ctxState : ctx.state,
	  data : {
  		token : ctx.query.token,
  		versionId: ctx.state.courseDetail.versionId
  	}
	}).then((res) => {
	  ctx.state.courseactivestatus = res.data;
	  return next();
	})
  
}