let static={
    method: 'GET',
    path: '/staticFile',
    handler: function (request, reply) {
        reply.file('./public/static.html');
    }
};
// module.exports=static;

let temp={
    method: 'GET',
    path: '/view',
    config: {
        auth: false,
        handler: function (request, reply) {
            reply.view('login');
        }
    }
};
module.exports=[static,temp];