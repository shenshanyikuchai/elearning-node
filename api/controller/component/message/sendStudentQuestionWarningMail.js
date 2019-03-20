
module.exports = async(ctx, next) => {
	if(ctx.state.teachersMail && ctx.state.teachersMail.length){
		for(let item of ctx.state.teachersMail){
			if(item){
					await ZBG.Request.ajax({
						url: 'http://123.126.152.178:8084/api/base/mail/sendStudentQuestionWarningMail',
					  server : 'sendStudentQuestionWarningMail',
					  ctxState : ctx.state,
					  data : {
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