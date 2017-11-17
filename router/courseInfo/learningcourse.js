const Request = require('../../request')

module.exports = async(ctx, next) => {
    await Request.ajax('learningcourse', {
        "token": ctx.query.token,
        "pageNo": 1,
        "pageSize": 999
    }).then((res) => {
        ctx.state.learningcourse = res.data;
        return next();
    })
}