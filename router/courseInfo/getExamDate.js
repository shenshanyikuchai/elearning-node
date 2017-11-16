const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx, next) => {
	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
	await axios.get('http://api.caicui.com/api/zbids/app/gettoken/v1.0/', {
	    params: {
	    	"memberId": "ff8080815133db0d0151375bfdf30c0d"
	    }
	  }).then(function(res){
	  	ctx.state.getExamDate = res.data.data;
	  	// ctx.body = ctx.state
    	return next();
	  })
}