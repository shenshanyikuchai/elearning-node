const Request = require('../../request');
const constant = require('../../global/constant');
const Filter = require('../../filter');
const iGlobal = require('../../global');

module.exports = async (ctx, next) => {
	// ctx.state.mock = true;
	if (ctx.query.memberId && ctx.query.token) {
		await Request.ajax({
			server: 'learningcourse',
			ctxState: ctx.state,
			data: {
				techType: ctx.query.type || 'onlinecourse',
				token: ctx.query.token,
				pageNo: 0,
				pageSize: 999
			}
		}).then(async (resCourse) => {
			// ctx.state.mock = false;
			let courseArr = [];
			for (let i = 0; i < resCourse.data.courselist.length; i++) {
				courseArr.push(resCourse.data.courselist[i].courseId);
			}
			await Request.ajax({
				server: 'getCourseProgress',
				ctxState: ctx.state,
				data: {
					token: ctx.query.token,
					memberId: ctx.query.memberId,
					courseId: courseArr.toString()
				}
			}).then((resProgress) => {
				for (var i = 0; i < resCourse.data.courselist.length; i++) {
					var thisCourseData = resCourse.data.courselist[i];
					thisCourseData.courseGroupId = thisCourseData.courseGroupId ? thisCourseData.courseGroupId : '';
					for (var j = 0; j < resProgress.data.length; j++) {
						
						var thisProgressData = resProgress.data[j];
						

						if (thisCourseData.courseId == thisProgressData.courseId) {
							// thisCourseData.courseProgress = thisProgressData.courseProgress ? thisProgressData.courseProgress : 0;
							thisCourseData.courseProgress = iGlobal.getProgress(thisProgressData.courseProgress, thisCourseData.taskTotal);

							thisCourseData.createDate = thisProgressData.createDate;
							thisCourseData.chapterId = thisProgressData.chapterId;
							thisCourseData.chapterName = thisProgressData.chapterName;
							thisCourseData.progress = thisProgressData.progress;
							thisCourseData.taskId = thisProgressData.taskId;
							thisCourseData.taskName = thisProgressData.taskName;
						}
					}
				}
				ctx.state.data = Filter.studyIn({
					studyIn: resCourse.data.courselist
				})
				return next();
			})
		})
	} else {
		ctx.state.response = constant.response.noparameter;
	}
}