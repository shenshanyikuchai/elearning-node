const Request = require('../../request');
const constant = require('../../global/constant');
const Filter = require('../../filter');
module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.memberId && ctx.query.token){
		await Request.ajax({
		  server : 'noActivecourse',
		  ctxState : ctx.state,
		  data : {
	  		token : ctx.query.token,
	  		pageNo : 0,
	  		pageSize : 999
	  	}
		}).then(async (resCourse) => {
			ctx.state.data = Filter.notActivated({
				notActivated : resCourse.data.courselist
			})
			return next();
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}