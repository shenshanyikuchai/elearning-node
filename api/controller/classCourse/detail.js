
module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.classId && ctx.query.memberId && ctx.query.courseId){
		await next();
		ctx.state.data = ZBG.Filter.classCourse({
			courseDetail : ctx.state.courseDetail,
			tasksProgress : ctx.state.getTasksProgress,
			examDate : ctx.state.getExamDate,
			memberGetplan : ctx.state.memberGetplan,
			courseactivestatus : ctx.state.courseactivestatus
		})
	}else{
		ctx.state.response = ZBG.COMMON.response.noparameter;
	}
}