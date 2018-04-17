const Request = require('../../request');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.token && ctx.state.courseDetail.subjectId && ctx.query.courseId){
		await Request.ajax({
		  server : 'memberGetplan',
		  ctxState : ctx.state,
		  data : {
		    token: ctx.query.token,
		    courseCategoryId: ctx.state.courseDetail.subjectId,
		    courseId: ctx.query.courseId
		  }
		}).then((res) => {
			
			if(res.state == "success"){
				ctx.state.memberGetplan = res.data;
			}else{
				ctx.state.memberGetplan = [];
			}
		  
		  return next();
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}