const Request = require('../../request');

module.exports = async(ctx, next) => {
	ctx.state.mock = true;
	await Request.ajax({
	  server : 'learningcourse',
	  ctxState : ctx.state,
	  data : {
  		token : ctx.query.token
  	}
	}).then((res) => {
	  ctx.state.data = {
	  	courseListNav : res.data.courseListNav,
	  	courseLists : res.data.courseLists
	  }
	  return next();
	})
  
}