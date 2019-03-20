const _ = require('lodash');
const iGlobal = require('../../global');
const constant = require('../../global/constant');
var globalExerciseIdList = [];
var globalExercise = [];

function filterExerciseId(payload) { // 将多层课程结构转换为一层结构
	payload.level ? payload.level++ : payload.level = 1;

	payload.chapters.forEach((element, index) => {
		payload.rootNode = '';
		payload.newNode = '';

		switch (payload.level) {
			case 3:
				payload.rootNode = payload.oldNode;
				payload.newNode = payload.node + '-' + index;
				payload.orderList = (payload.orderList + 1);
				break;
			case 2:
				payload.rootNode = payload.oldNode;
				payload.newNode = payload.node + '-' + index;
				payload.orderList = (payload.node * 10000) + ((index + 1) * 100);
				break;
			case 1:
				payload.newNode = index.toString();
				payload.node = index.toString();
				payload.rootNode = index.toString();
				payload.orderList = index * 10000;
				break;
		}
		let nodeData = {
			level: payload.level, // 层级
			rootNode: payload.rootNode, // 根节点
			parentNode: payload.node, // 父节点
			node: payload.newNode, // 节点
			orderList: payload.orderList,
			isFree: element.isFree, // 是否免费
			title: element.chapterTitle, // 章节标题
			chapterId: element.chapterId, // 章节id
		}
		let isChildren = "false";
		let isTasks = false;

		if (element.tasks && element.tasks.length) {
			isTasks = true;
			filterExerciseIdList(element);
		}
		if (element.children && element.children.length) {
			isChildren = "true";
		}
		if (isChildren == "true") {
			arguments.callee({
				chapters: element.children,
				level: payload.level,
				node: payload.newNode,
				oldNode: payload.node,
				rootNode: payload.rootNode,
				orderList: payload.orderList,
			})
		}
	})
}

function filterExerciseIdList(chapter) {
	let tasks = chapter.tasks;
	for (let task of tasks) {
		if (task.taskType == "exam") {
			globalExerciseIdList.push(task.id);
			// appraisal:测评,midterm:期中,end:期末,task:作业
			// practice:练习,core:核心,extension:扩展,backup:备份

			let taskLevelArr = {
				appraisal: '测评',
				midterm: '期中',
				end: '期末',
				task: '作业',
				practice: '练习',
				core: '核心',
				extension: '扩展',
				backup: '备份'
			};

			globalExercise.push({
				id: task.id,
				title: task.title,
				examTypeName: taskLevelArr[task.taskLevel],
				taskType: task.taskType,
				taskLevel: task.taskLevel,
				endTime: iGlobal.getDate(task.endDate)
			})
		}
	}

}

function exerciseIdList(payload) {
	globalExerciseIdList = [];
	globalExercise = [];
	filterExerciseId(payload.exerciseIdList)
<<<<<<< HEAD
=======
	// console.log(globalExerciseIdList.join(','))
>>>>>>> 7ebc21fcb7ef41e53856eb13addc6694ae67161e
	return {
		"exerciseIdList": globalExerciseIdList,
		"exercise": globalExercise
	}
}

module.exports = {
	exerciseIdList
}