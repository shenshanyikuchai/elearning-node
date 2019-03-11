
module.exports = async(ctx, next) => {
	await ZBG.Request.ajax({
	  server : 'insertMessage',
	  ctxState : ctx.state,
	  data : {
  		type:1, // 1 论坛
  		receiveIds: ctx.state.teachers, // 接受人member_id  多个 逗号分割
  		sendId: ctx.state.memberId, // 发送者membet_id
  		messageType: 2, // 1 系统  2 用户
  		postId: ctx.state.postId, // 帖子id
  		title: ctx.state.title, // 标题
  		content: ctx.state.content // 内容
  	}
	}).then((res) => {
	  ctx.state.insertMessage = res.data;
	  return next();
	})
  
}