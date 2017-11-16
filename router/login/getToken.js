const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx, next) => {
	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
	await axios.get('http://api.caicui.com/api/zbids/app/gettoken/v1.0/', {
	    params: {
	    	"appType": "pc",
	    	"appId": "pcWeb",
	    	"appKey": "e877000be408a6cb0428e0f584456e03"
	    }
	  }).then(function(res){
	  	ctx.state.token = res.data.data.token;
    	return next();
	  })
}