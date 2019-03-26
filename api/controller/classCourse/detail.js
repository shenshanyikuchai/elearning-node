<<<<<<< HEAD

module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.classId && ctx.query.memberId && ctx.query.courseId){
		await next();
		ctx.state.data = ZBG.Filter.classCourse({
=======
const iGlobal = require('../../global');
const constant = require('../../global/constant');
const Filter = require('../../filter');

module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		ctx.state.data = Filter.classCourse({
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
			courseDetail : ctx.state.courseDetail,
			tasksProgress : ctx.state.getTasksProgress,
			examDate : ctx.state.getExamDate,
			memberGetplan : ctx.state.memberGetplan,
			courseactivestatus : ctx.state.courseactivestatus
		})
	}else{
<<<<<<< HEAD
		ctx.state.response = ZBG.COMMON.response.noparameter;
=======
		ctx.state.response = constant.response.noparameter;
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
	}
}