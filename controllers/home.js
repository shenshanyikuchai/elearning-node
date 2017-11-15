
let home = async (ctx,next) => {
	await axios.get('http://api.zbgedu.com/api/zbids/app/gettoken/v1.0/', {
    params: {
    	"appType": "pc",
    	"appId": "pcWeb",
    	"appKey": "e877000be408a6cb0428e0f584456e03"
    }
  }).then(res => {
  	console.log(res.data)
  	ctx.body = res.data
  }).catch(err => console.log(err))
}
module.exports = {
	'GET /' : home,
	'GET /home' : home
}