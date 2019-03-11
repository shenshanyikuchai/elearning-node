
module.exports = async(ctx, next) => {
	await ZBG.Request.ajax({
	  server : 'getTeacherData',
	  ctxState : ctx.state,
	  data : {
  		courseId: ctx.state.courseId,
  		lessonCategoryId : ctx.state.chapterId
  	}
	}).then((res) => {
		if(res.data && res.data.length){
			let teachers = [];
			let teachersMail = [];
			for(let item of res.data){
				teachers.push(item.id);
				teachersMail.push(item.email);
			}
			ctx.state.teachers = teachers.toString();
			ctx.state.teachersMail = teachersMail;
			return next();
		}
	  
	})
  
}