const axios = require('axios');
function getToken() {
  return axios.get('http://api.zbgedu.com/api/zbids/app/gettoken/v1.0/', {
    params: {
    	"appType": "pc",
    	"appId": "pcWeb",
    	"appKey": "e877000be408a6cb0428e0f584456e03"
    }
  })
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}


let token = async (ctx,next) => {

}
let login = async (ctx,next) => {
	axios.all([getToken()]).then(axios.spread(function (token) {
		console.log(token.data.data.token)
  	axios.post('http://api.zbgedu.com/api/zbids/member/login/v1.0',{
	      'account' : 'zpk',
	      'password' : '123456',
	      'token' : token.data.data.token
	    }).then(res => {
    	console.log(res.data)
    	ctx.body = res.data
    }).catch(err => console.log(err))
  }));
}
module.exports = {
	'GET /login' : token,login
}