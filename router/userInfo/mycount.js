const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx, next) => {
	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
	await axios.get('http://api.caicui.com/api/studytools/mycount/v2.1', {
	    params: {
	    	"token": "e42da353-0582-4325-97d0-babb4624c227"
	    }
	  }).then(function(res){
	  	ctx.state.mycount = res.data.data;
    	return next();
	  })
}