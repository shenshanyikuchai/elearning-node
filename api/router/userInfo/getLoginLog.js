const Request = require('../../request')

module.exports = async (ctx, next) => {
	await Request.ajax({
  	server : "getLoginLog",
  	mock : ctx.state.mock,
  	data : {
  	  memberid: ctx.query.memberId,
  	  pageNo: 1,
  	  pageSize: 1
  	}
  }).then(function(res){
  	ctx.state.getLoginLog = res.data.data;
  	return next();
  })
}