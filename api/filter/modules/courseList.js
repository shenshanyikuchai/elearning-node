const _ = require('lodash');

function indexToString(list){
	list.forEach((item) => {
		item.categoryIndex = parseInt(item.categoryIndex);
		item.subjectIndex = parseInt(item.subjectIndex);
		item.courseIndex = parseInt(item.courseIndex);
	})
	return list;
}

function getCategoryNav(list){
	let categoryNav = _.chain(list)
		.sortBy('categoryIndex')
		.uniqBy('categoryId')
		.map((list) => {
			return {
				"categoryId": list.categoryId ? list.categoryId : null,
				"categoryName": list.categoryName ? list.categoryName : null,
				"categoryIndex": list.categoryIndex ? list.categoryIndex : null,
				"list": [],
				"newList": []
			}
		})
		.value();
	return categoryNav;
}

function getCategoryGroup(list){
	let categoryGroup = _.chain(list)
		.groupBy('categoryName')
		.value();
	return categoryGroup;
}

function getSubjectNav(list){
	let subjectNav = _.chain(list)
		.sortBy('subjectIndex')
		.uniqBy('subjectID')
		.map((list) => {
			return {
				"subjectID": list.subjectID ? list.subjectID : null,
				"subjectName": list.subjectName ? list.subjectName : null,
				"subjectIndex": list.subjectIndex ? list.subjectIndex : null,
				"list": []
			}
		})
		.value();
	return subjectNav;
}

function getSubjectGroup(list){
	let subjectGroup = _.chain(list)
		.groupBy('subjectName')
		.value();
	return subjectGroup;
}

function studyIn(payload) {
	let data = indexToString(payload.studyIn);
	let courseLists = getCategoryNav(data);
	const courseListNav = _.map(courseLists,(item) => item.categoryName);
	let categoryGroup = getCategoryGroup(data);
	courseLists.forEach((itemSubject) => {
		let subjectList = categoryGroup[itemSubject.categoryName];
		let subjectNav = getSubjectNav(subjectList);
		let subjectGroup = getSubjectGroup(subjectList);
		itemSubject.list = subjectList;
		subjectNav.forEach((itemCourse) => {
			let courseList = subjectGroup[itemCourse.subjectName];
			itemCourse.list = _.sortBy(courseList,'courseIndex')
		})
		itemSubject.newList = subjectNav;
	})
	return {
		"courseListNav": courseListNav,
		"courseLists": courseLists
	}

}

function notActivated(payload) {
	let data = indexToString(payload.notActivated);
	let courseLists = getCategoryNav(data);
	const courseListNav = _.map(courseLists,(item) => item.categoryName);
	let categoryGroup = getCategoryGroup(data);
	courseLists.forEach((itemSubject) => {
		let subjectList = categoryGroup[itemSubject.categoryName];
		let subjectNav = getSubjectNav(subjectList);
		let subjectGroup = getSubjectGroup(subjectList);
		itemSubject.list = subjectList;
		subjectNav.forEach((itemCourse) => {
			let courseList = subjectGroup[itemCourse.subjectName];
			itemCourse.list = _.sortBy(courseList,'courseIndex')
		})
		itemSubject.newList = subjectNav;
	})
	return {
		"courseListNav": courseListNav,
		"courseLists": courseLists
	}
}

function expiration(payload) {
	let data = indexToString(payload.expiration);
	let courseLists = getCategoryNav(data);
	const courseListNav = _.map(courseLists,(item) => item.categoryName);
	let categoryGroup = getCategoryGroup(data);
	courseLists.forEach((itemSubject) => {
		let subjectList = categoryGroup[itemSubject.categoryName];
		let subjectNav = getSubjectNav(subjectList);
		let subjectGroup = getSubjectGroup(subjectList);
		itemSubject.list = subjectList;
		subjectNav.forEach((itemCourse) => {
			let courseList = subjectGroup[itemCourse.subjectName];
			let auditState = 2;
			_.forEach(payload.applyrestudylist, (element) => {
				if (element.courseCategoryId == itemCourse.subjectId) {
					auditState = element.auditState;
				}
			})
			itemCourse.auditState = auditState;
			_.forEach(courseList,(element) => {
				var state = 0
				var stateText = '重新购买';
				if (element.isU == 2) {
					if (auditState == 0) {
						state = 2;
						stateText = '审核中';
					} else {
						state = 1;
						stateText = '申请重听';
					}
				}
				element.state = state;
				element.stateText = stateText;
			})
			

			itemCourse.list = _.sortBy(courseList,'courseIndex')
		})
		itemSubject.newList = subjectNav;
	})
	return {
		"courseListNav": courseListNav,
		"courseLists": courseLists
	}
}

function getCategorySubject(payload) {
	let classCourse = getClassCourses(payload.classCourseList);
	let studyInData = {}
	
	if(payload.learningcourse && payload.learningcourse.length){
		studyInData = {
			studyIn : [...classCourse,...payload.learningcourse]
		}
	}else{
		studyInData = {
			studyIn : [...classCourse]
		}
	}
	let categorySubject =  studyIn(studyInData);
	
	let formatCategorySubject = filterCategorySubject(categorySubject);
	return {
		data : formatCategorySubject
	}
}
function getClassCourses(payload){
	let classCourse = [];
	if(payload.data && payload.data.length){
		payload.data.forEach((item) => {
			if(item.classCourse && item.classCourse.length){
				classCourse.push(...item.classCourse)
			}
		})
	}
	return classCourse;
}
function filterCategorySubject(payload) {
	let filterCategorySubject = {};
	if(payload.courseLists && payload.courseLists.length){
		payload.courseLists.forEach((item) => {
			if(item.newList && item.newList.length){
				let subjectArray = item.newList.map((item) => {
					// return item.subjectName;
					return item.subjectID;
				})
				filterCategorySubject[item.categoryName] = subjectArray
			}
			
		})
	}
	return filterCategorySubject;
}
module.exports = {
	studyIn,
	notActivated,
	expiration,
	getCategorySubject
}