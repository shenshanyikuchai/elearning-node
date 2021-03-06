const Request = require('../../request');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	await Request.ajax({
	  server : 'getClassPlanDetail',
	  ctxState : ctx.state,
	  data : {
	    classId: ctx.query.classId,
	    courseId: ctx.query.courseId,
	    planType: 1
	  }
	}).then((res) => {
		
		if(res.state == "success"){
			ctx.state.memberGetplan = res.data;
		}else{
			ctx.state.memberGetplan = [];
		}
	  
	  return next();
	})
	
}