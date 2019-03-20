const axios = require('axios');
const Request = require('../../../request');

module.exports = async (ctx, next) => {
	// ctx.state.mock = true;
	// ctx.state.exerciseIdList
	await Request.ajax({
		server: "courseDetail",
		ctxState: ctx.state,
		data: {
			courseId: ctx.query.courseId
		}
	}).then((res) => {
		if(res.data && res.data.length){
			ctx.state.exerciseIdList = res.data[0];
		}else{
			ctx.state.exerciseIdList = {}
		}
		
		return next();
	})

}