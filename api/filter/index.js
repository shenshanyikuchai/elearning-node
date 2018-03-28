const header = require('./header');
const courseIndex = require('./courseIndex');
const { classCourse, classCourseClear } = require('./classCourse');
const examReport = require('./examReport');

module.exports = {
	header : header,
	courseIndex : courseIndex,
	classCourse : classCourse,
	classCourseClear : classCourseClear,
	examReport : examReport
}