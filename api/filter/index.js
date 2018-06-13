const header = require('./header');
const courseIndex = require('./courseIndex');
const { classCourse } = require('./classCourse');
const { teachingCourse, teachingCourseClear } = require('./teachingCourse');
const examReport = require('./examReport');
const { coursePlanDetail } = require('./modules/coursePlanDetail');
const { studyIn, notActivated, expiration } = require('./modules/courseList');

module.exports = {
	header : header,
	courseIndex : courseIndex,
	classCourse : classCourse,
	teachingCourse : teachingCourse,
	teachingCourseClear : teachingCourseClear,
	examReport : examReport,
	coursePlanDetail : coursePlanDetail,
	studyIn : studyIn,
	notActivated : notActivated,
	expiration : expiration
}