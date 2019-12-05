module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId && ctx.query.classId){
		await next();
		if(ctx.state.isCourseDetail){
			ctx.state.data = ctx.Filter.iCoursePlanDetail({
				UAType : ctx.state.UAType,
				courseDetail : ctx.state.courseDetail,
				tasksProgress : ctx.state.getTasksProgress,
				examDate : ctx.state.getExamDate,
				coursePlan : ctx.state.memberGetplan,
				courseactivestatus : ctx.state.courseactivestatus,
				getCourseArrange : ctx.state.getCourseArrange
			})
		}
	}else{
		ctx.state.response = ctx.constant.response.noparameter;
	}
}