module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		if(ctx.state.isCourseDetail){
			ctx.state.data = ctx.Filter.iCourseCalendar({
				UAType : ctx.state.UAType,
				courseDetail : ctx.state.courseDetail,
				tasksProgress : ctx.state.getTasksProgress,
				coursePlan : ctx.state.memberGetplan
			})
		}
	}else{
		ctx.state.response = ctx.constant.response.noparameter;
	}
}