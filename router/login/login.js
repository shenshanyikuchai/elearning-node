const axios = require('axios');
const qs = require('qs');
module.exports = async (ctx) => {
  // http://192.168.10.34:8080/Api/api/zbids/member/login/v1.0
  await axios.post('http://api.caicui.com/api/zbids/member/login/v1.0', qs.stringify({
  		token : ctx.state.token,
      account : 'zpk',
      password : '123456'
    })).then(function (response) {
      ctx.body = response.data
    }).catch(function (error) {
      console.log(error);
    });
}