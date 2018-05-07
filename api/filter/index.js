const header = require('./header');
const courseIndex = require('./courseIndex');
const { classCourse } = require('./classCourse');
const { teachingCourse, teachingCourseClear } = require('./teachingCourse');
const examReport = require('./examReport');
const { coursePlanDetail } = require('./modules/coursePlanDetail');

module.exports = {
	header : header,
	courseIndex : courseIndex,
	classCourse : classCourse,
	teachingCourse : teachingCourse,
	teachingCourseClear : teachingCourseClear,
	examReport : examReport,
	coursePlanDetail : coursePlanDetail
}