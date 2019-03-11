const _ = require('lodash');

function studyIn(payload) {
	var stooges = payload.studyIn;
	var courseListNav = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryName ? stooge.categoryName : null;
		})
		.uniq()
		.value();
	var courseListIndex = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryIndex ? stooge.categoryIndex : 0;
		})
		.uniq()
		.value();
	var courseLists = [];
	for (var i = 0; i < courseListNav.length; i++) {
		courseLists.push({
			"categoryName": courseListNav[i],
			"categoryIndex": courseListIndex[i],
			"list": []
		});
		_.each(stooges, function(element, index, list) {
			if (element.categoryName == courseListNav[i]) {
				if (courseLists && courseLists[i] && courseLists[i].list) {
					courseLists[i].list.push(element)
					// var add = true;
					// _.each(courseLists[i].list,function(ele, index, list){
					// 	if(element.courseId == ele.courseId){
					// 		add = false;
					// 	}
					// });
					// if(add){
					// 	courseLists[i].list.push(element);
					// }
				} else {
					courseLists[i].list = [element];
				}

			}
		});
	}

	for (var i = 0; i < courseLists.length; i++) {
		courseLists[i].newList = [];
		var stooge = courseLists[i].list;
		// var subjectData = _.chain(stooge)
		// 	.map(function(stooge) {
		// 		return {
		// 			subjectIndex: stooge.subjectIndex,
		// 			subjectName : stooge.subjectName,
		// 			subjectID : stooge.subjectID,
		// 		}
		// 	})
		// 	.uniq()
		// 	.value();
		var subjectIdArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectID;
			})
			.uniq()
			.value();
		var subjectNameArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectName;
			})
			.uniq()
			.value();
		var subjectIndexArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectIndex;
			})
			.uniq()
			.value();
		
		for (var j = 0; j < subjectIdArray.length; j++) {
			courseLists[i].newList.push({
				"subjectName": subjectNameArray[j],
				"subjectID": subjectIdArray[j],
				"subjectIndex": subjectIndexArray[j],
				"list": []
			})
			_.each(courseLists[i].list, function(element, index, list) {
				if (element.subjectID == subjectIdArray[j]) {
					if (courseLists[i].newList[j].list && courseLists[i].newList[j].list.length) {
						//courseLists[i].newList[j].list.push(element);
						var add = true;
						_.each(courseLists[i].newList[j].list, function(ele, index, list) {
							if (element.courseId == ele.courseId) {
								add = false;
							}
						});
						if (add) {
							courseLists[i].newList[j].list.push(element);
						}
					} else {
						courseLists[i].newList[j].list = [element];
					}

				}
			});
		}
	}
	var courseLists = _.sortBy(courseLists, 'categoryIndex');
	_.each(courseLists, function(element, index) {
		courseLists[index].newList = _.sortBy(element.newList, 'subjectIndex');
		_.each(courseLists[index].newList, function(elements, item) {
			courseLists[index].newList[item].list = _.sortBy(elements.list, 'courseIndex');
		})
	})
	return {
		"courseListNav": courseListNav,
		"courseLists": courseLists
	}
}

function notActivated(payload) {
	var stooges = payload.notActivated;
	var courseListNav = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryName ? stooge.categoryName : null;
		})
		.uniq()
		.value();
	var courseListIndex = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryIndex ? stooge.categoryIndex : 0;
		})
		.uniq()
		.value();
	var courseLists = [];
	for (var i = 0; i < courseListNav.length; i++) {
		courseLists.push({
			"categoryName": courseListNav[i],
			"categoryIndex": courseListIndex[i],
			"list": []
		});
		_.each(stooges, function(element, index, list) {
			if (element.categoryName == courseListNav[i]) {
				if (courseLists && courseLists[i] && courseLists[i].list) {
					courseLists[i].list.push(element)
					// var add = true;
					// _.each(courseLists[i].list,function(ele, index, list){
					// 	if(element.courseId == ele.courseId){
					// 		add = false;
					// 	}
					// });
					// if(add){
					// 	courseLists[i].list.push(element);
					// }
				} else {
					courseLists[i].list = [element];
				}

			}
		});
	}

	for (var i = 0; i < courseLists.length; i++) {
		courseLists[i].newList = []
		var stooge = courseLists[i].list
		var subjectNameArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectName;
			})
			.uniq()
			.value();
		var subjectIndexArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectIndex;
			})
			.uniq()
			.value();
		for (var j = 0; j < subjectNameArray.length; j++) {
			courseLists[i].newList.push({
				"subjectName": subjectNameArray[j],
				"subjectIndex": subjectIndexArray[j],
				"list": []
			})
			_.each(courseLists[i].list, function(element, index, list) {
				if (element.subjectName == subjectNameArray[j]) {

					if (courseLists[i].newList[j].list) {
						//courseLists[i].newList[j].list.push(element);
						var add = true;
						_.each(courseLists[i].newList[j].list, function(ele, index, list) {
							if (element.courseId == ele.courseId) {
								add = false;
							}
						});
						if (add) {
							courseLists[i].newList[j].list.push(element);
						}
					} else {
						courseLists[i].newList[j].list = [element];
					}

				}
			});
		}
	}
	var courseLists = _.sortBy(courseLists, 'categoryIndex');
	_.each(courseLists, function(element, index) {
		courseLists[index].newList = _.sortBy(element.newList, 'subjectIndex');
		_.each(courseLists[index].newList, function(elements, item) {
			courseLists[index].newList[item].list = _.sortBy(elements.list, 'courseIndex');
		})
	})
	return {
		"courseListNav": courseListNav,
		"courseLists": courseLists
	}
}

function expiration(payload) {
	var stooges = payload.expiration;
	var courseListNav = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryName ? stooge.categoryName : null;
		})
		.uniq()
		.value();
	var courseListIndex = _.chain(stooges)
		.map(function(stooge) {
			return stooge.categoryIndex ? stooge.categoryIndex : 0;
		})
		.uniq()
		.value();
	var courseLists = [];
	for (var i = 0; i < courseListNav.length; i++) {
		courseLists.push({
			"categoryName": courseListNav[i],
			"categoryIndex": courseListIndex[i],
			"list": []
		});
		_.each(stooges, function(element, index, list) {
			if (element.categoryName == courseListNav[i]) {
				if (courseLists && courseLists[i] && courseLists[i].list) {
					courseLists[i].list.push(element)
				} else {
					courseLists[i].list = [element];
				}

			}
		});
	}

	for (var i = 0; i < courseLists.length; i++) {
		courseLists[i].newList = []
		var stooge = courseLists[i].list

		var subjectNameArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectName;
			})
			.uniq()
			.value();
		var subjectIndexArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectIndex;
			})
			.uniq()
			.value();
		var subjectIdArray = _.chain(stooge)
			.map(function(stooge) {
				return stooge.subjectID;
			})
			.uniq()
			.value();

		for (var j = 0; j < subjectNameArray.length; j++) {
			var auditState = 2;
			_.forEach(payload.applyrestudylist, (element) => {
				if (element.courseCategoryId == subjectIdArray[j]) {
					auditState = element.auditState;
				}
			})
			courseLists[i].newList.push({
				"auditState": auditState,
				"subjectId": subjectIdArray[j],
				"subjectName": subjectNameArray[j],
				"subjectIndex": subjectIndexArray[j],
				"list": []
			})
			_.each(courseLists[i].list, function(element, index, list) {
				if (element.subjectName == subjectNameArray[j]) {
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

					if (courseLists[i].newList[j].list) {
						//courseLists[i].newList[j].list.push(element);
						var add = true;
						_.each(courseLists[i].newList[j].list, function(ele, index, list) {
							if (element.courseId == ele.courseId) {
								add = false;
							}
						});
						if (add) {
							courseLists[i].newList[j].list.push(element);
						}
					} else {
						courseLists[i].newList[j].list = [element];
					}

				}
			});
		}
	}
	var courseLists = _.sortBy(courseLists, 'categoryIndex');
	_.each(courseLists, function(element, index) {
		courseLists[index].newList = _.sortBy(element.newList, 'subjectIndex');
		_.each(courseLists[index].newList, function(elements, item) {
			courseLists[index].newList[item].list = _.sortBy(elements.list, 'courseIndex');
		})
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
				console.log(item.newList)
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