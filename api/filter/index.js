const header = require('./header');
const courseIndex = require('./courseIndex');
const { classCourse, classCourseClear } = require('./classCourse');
const { teachingCourse, teachingCourseClear } = require('./classCourse');
const examReport = require('./examReport');


module.exports = {
	header : header,
	courseIndex : courseIndex,
	classCourse : classCourse,
	classCourseClear : classCourseClear,
	teachingCourse : teachingCourse,
	teachingCourseClear : teachingCourseClear,
	examReport : examReport
}