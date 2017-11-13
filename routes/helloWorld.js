let index={
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        reply('hello,world');
    }
};
let hello={
    method: ['GET', 'POST'],
    path: '/hello/{user?}',
    handler: function (request, reply) {
        reply('Hello ' + encodeURIComponent(request.params.user) + '!');
    }
};
module.exports=[index,hello];