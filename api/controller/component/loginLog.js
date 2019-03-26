const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
	  server : 'getLoginLog',
	  ctxState : ctx.state,
	  data : {
	    memberid: ctx.query.memberId,
      pageNo: 1,
      pageSize: 1
	  }
	}).then((res) => {
	  ctx.state.loginLog = res.data;
	  return next();
	})
}