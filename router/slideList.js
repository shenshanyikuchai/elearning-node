const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx, next) => {
	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
	await axios.get('http://api.caicui.com/api/article/slide/list', {
	    params: {
	    	"tag": "0",
	    	"valid": "true",
	    	"count": "4"
	    }
	  }).then(function(res){
	  	ctx.state.slideList = res.data.data;
    	return next();
	  })
}