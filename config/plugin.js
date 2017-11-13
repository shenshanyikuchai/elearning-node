const SwaggerOptions = {
    info: {
        'title': 'hapiDemo API Documentation',
        'version': '0.0.1'
    }
};

const goodOptions = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' ,request:'*'}]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./log/fixtures/awesome_log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};
module.exports = [
    // {
    //     register:require('good'),
    //     goodOptions,
    // },
    {
      register:require('hapi-auth-jwt2')
    },
    {
        register:require('inert')
    },
    {
        register:require('hapi-auth-basic')
    },
    // {
    //     register:require('./../auth')
    // },
    {
        'register': require('hapi-swagger'),
        'options': SwaggerOptions
    },
    {
        register:require('vision')
    }
];