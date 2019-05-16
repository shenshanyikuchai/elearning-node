const header = require('./header');
const courseIndex = require('./courseIndex');
const {
	classCourse
} = require('./classCourse');
const {
	teachingCourse,
	teachingCourseClear
} = require('./teachingCourse');
const examReport = require('./examReport');
const {
	coursePlanDetail,
	getCoursePlanDetailType
} = require('./modules/coursePlanDetail');
const {
	ezCoursePlanDetail
} = require('./modules/ezCoursePlanDetail');
const {
	courseCalendar
} = require('./modules/courseCalendar');
const {
	studyIn,
	notActivated,
	expiration,
	getCategorySubject
} = require('./modules/courseList');
const {
	exerciseIdList
} = require('./modules/exerciseIdList');


module.exports = {
	header: header,
	courseIndex: courseIndex,
	classCourse: classCourse,
	teachingCourse: teachingCourse,
	teachingCourseClear: teachingCourseClear,
	examReport: examReport,
	coursePlanDetail: coursePlanDetail,
	getCoursePlanDetailType: getCoursePlanDetailType,
	ezCoursePlanDetail: ezCoursePlanDetail,
	studyIn: studyIn,
	notActivated: notActivated,
	expiration: expiration,
	exerciseIdList: exerciseIdList,
	getCategorySubject: getCategorySubject,
	courseCalendar: courseCalendar
}