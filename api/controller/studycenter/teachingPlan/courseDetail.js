const iGlobal = require('../../../global');
const constant = require('../../../global/constant');
const Filter = require('../../../filter');

module.exports = async(ctx, next) => {
	
	if(ctx.query.classId && ctx.query.courseId && ctx.query.memberId){
		await next();
		ctx.state.data = Filter.studycenterCoursePlanDetail({
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