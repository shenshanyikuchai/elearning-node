const server=require('./server');

server.start(err=>{
    if(err) throw err;
   console.log( `Server running at: ${server.info.uri}`);
});
/*
require("babel-polyfill") //regeneratorRuntime for async/await

//if not production...
require("babel-register")

const server = require('./hapi')

server.start(function () {
    console.log('api server running at:', server.info.uri)
})
*/