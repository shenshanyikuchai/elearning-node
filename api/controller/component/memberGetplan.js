const Request = require('../../request');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	await Request.ajax({
	  server : 'getStudyPlanList',
	  ctxState : ctx.state,
	  data : {
	    token: ctx.query.token,
	    courseId: ctx.query.courseId
	  }
	}).then((res) => {
<<<<<<< HEAD
		// if(res.state == "success"){
		// 	ctx.state.memberGetplan = res.data;
		// }else{
		// 	ctx.state.memberGetplan = [];
		// }
		if(res.success){
=======
		if(res.state == "success"){
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
			ctx.state.memberGetplan = res.data;
		}else{
			ctx.state.memberGetplan = [];
		}
	  return next();
	})
	
}