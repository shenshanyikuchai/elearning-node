const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const axiosConfig = require('./request/config');
const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const qs = require('qs')


const app = new Koa();
const router = new Router();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
// app.use(axios);
// parse request body:
app.use(bodyParser());


// axios.defaults.headers.post['Content-Type'] = 'application/json';


// add controllers:
// app.use(controller());
router.get(
  '/login',
  async (ctx, next) => {
  	//http://192.168.10.34:8080/Api/api/zbids/app/gettoken/v1.0/
  	await axios.get('http://demo.caicui.com/api/zbids/app/gettoken/v1.0/', {
  	    params: {
  	    	"appType": "pc",
  	    	"appId": "pcWeb",
  	    	"appKey": "e877000be408a6cb0428e0f584456e03"
  	    }
  	  }).then(function(res){
  	  	ctx.state.token = res.data.data.token;
      	return next();
  	  })
  },
  async (ctx) => {
    console.log(ctx.state);
    // http://192.168.10.34:8080/Api/api/zbids/member/login/v1.0
    await axios.post('http://demo.caicui.com/api/zbids/member/login/v1.0', qs.stringify({
    		token : ctx.state.token,
        account : 'zpk',
        password : '123456'
      })).then(function (response) {
    		console.log(response)
        ctx.body = response.data
      })
      .catch(function (error) {
        console.log(error);
        // ctx.body = error
      });
  }
);
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
console.log('app started at port 3000...');

