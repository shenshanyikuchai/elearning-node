const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
	  server : 'getCourseArrange',
	  ctxState : ctx.state,
	  data : {
	    'classId': ctx.query.classId,
      'token': ctx.query.token,
      'pageNo': 1,
      'pageSize': 999
	  }
	}).then((res) => {
	  ctx.state.getCourseArrange = res.data;
	  return next();
	})
  
}