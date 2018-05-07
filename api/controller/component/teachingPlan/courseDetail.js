const iGlobal = require('../../../global');
const constant = require('../../../global/constant');
const Filter = require('../../../filter');

module.exports = async(ctx, next) => {
	
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		ctx.state.data = Filter.coursePlanDetail({
			courseDetail : ctx.state.courseDetail,
			tasksProgress : ctx.state.getTasksProgress,
			examDate : ctx.state.getExamDate,
			coursePlan : ctx.state.memberGetplan,
			courseStatus : ctx.state.courseactivestatus
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}