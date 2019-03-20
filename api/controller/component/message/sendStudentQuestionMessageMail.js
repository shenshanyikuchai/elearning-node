
module.exports = async(ctx, next) => {
	if(ctx.state.teachersMail && ctx.state.teachersMail.length){
		for(let item of ctx.state.teachersMail){
			if(item){
				await ZBG.Request.ajax({
					// url: 'http://123.126.152.178:8084/api/base/mail/sendStudentQuestionMessageMail',
					url: 'http://api.zbgedu.com/api/base/mail/sendStudentQuestionMessageMail',
				  server : 'sendStudentQuestionMessageMail',
				  ctxState : ctx.state,
				  data : {
				  	memberName: ctx.state.nikeName,
			  		email: item
			  	}
				}).then((res) => {
				  ctx.state.insertMessage = res.data;
				})
			}
			
		}
	}
	return next();
	
  
}