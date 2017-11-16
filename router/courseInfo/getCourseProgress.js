const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx, next) => {
	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
	await axios.get('http://api.caicui.com/api/zbids/app/gettoken/v1.0/', {
	    params: {
	    	"token": "e42da353-0582-4325-97d0-babb4624c227",
	    	"memeberId": "ff8080815133db0d0151375bfdf30c0d",
	    	"courseId" : ""
	    }
	  }).then(function(res){
	  	ctx.state.getCourseProgress = res.data.data;
    	return next();
	  })
}