const Request = require('../../request')

module.exports = async (ctx, next) => {
	await Request.ajax({
  	server : "mycount",
  	mock : ctx.state.mock,
  	data : {
  	  token: ctx.query.token
  	}
  }).then(function(res){
  	ctx.state.mycount = res.data.data;
  	return next();
  })
}