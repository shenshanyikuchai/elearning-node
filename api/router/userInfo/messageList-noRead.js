const Request = require('../../request')

module.exports = async (ctx, next) => {
	await Request.ajax({
  	server : "messageListNoRead",
  	mock : ctx.state.mock,
  	data : {
  	  token: ctx.query.token,
  	  isRead : "0",
  	  pageNo: 1,
  	  pageSize: 20
  	}
  }).then(function(res){
  	ctx.state.messageListNoRead = res.data.data;
  	return next();
  })
}