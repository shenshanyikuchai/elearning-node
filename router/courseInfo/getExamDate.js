const Request = require('../../request')

module.exports = async(ctx, next) => {
    await Request.ajax('getExamDate', {
        "memberId": ctx.query.memberId
    }).then((res) => {
        ctx.state.getExamDate = res.data;
        return next();
    })
}