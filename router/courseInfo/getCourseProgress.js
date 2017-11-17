const Request = require('../../request')
const querystring = require("querystring");

module.exports = async(ctx, next) => {
		let learningcourse = ctx.state.learningcourse;
		let learningcourseLength = learningcourse.length;
		let courseIds = [];
		for(var i=0;i<learningcourseLength;i++){
		  courseIds.push(learningcourse[i].courseId);
		}
    await Request.ajax('getCourseProgress', {
        "token": ctx.query.token,
        "memberId": ctx.query.memberId,
        "courseId": ''
    }).then((res) => {
        console.log(res)
        ctx.state.getCourseProgress = res.data;
        return next();
    })
}