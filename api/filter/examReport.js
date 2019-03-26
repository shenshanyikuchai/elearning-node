// https://action.zbgedu.com/api/userAction/scene/mobileIndex/examReport?verTT=1531361528702&memberId=ff808081509442fc0150a70c11184ead&knowledgePointId=01be4a3276c3ddbea594f4e006ec361e&examenNum=0

const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

function examReport(payload) {
	let isExamData = hasExamReport(payload);
	payload.exerciseStatus = getExerciseBaseInfo(payload);
	payload.knowledges = fileterKnowledge(payload);
	payload.exerciseSummary = getExerciseSummary(payload);

	return {
		isExamReport: isExamData.isExamReport,
		isExamState: isExamData.isExamState,

		examReport: {
			status: payload.exerciseStatus,
			knowledge: payload.knowledges,
			summary: payload.exerciseSummary,
			examType: payload.exam.examen_type,
			title: payload.exam.examen_name,
			subjectId: payload.exam.subject_id,
			courseId: payload.exam.course_id,
			chapterId: payload.exam.chapter_id,
			taskId: payload.exam.task_id
		}
	};
}

function hasExamReport(payload) {
	let isExamReport = false;
	let isExamState = 0; // 试卷 0未做，1完成，2未做完
	if (payload.isExam) {
		if (payload.exam.is_finish == "1") {
			isExamReport = true;
			isExamState = 1;
		} else {
			isExamState = 2;
		}
	}
	return {
		isExamReport: isExamReport,
		isExamState: isExamState
	};
}

function getExerciseBaseInfo(payload) {
	let exerciseStatus = [];
	// 根据试题id去重
	let newExercise = _.uniqBy(payload.exercise, 'exercise_id');
	for (let i = 0; i < payload.baseInfo.length; i++) {
		let elementBaseInfo = payload.baseInfo[i];
		exerciseStatus.push({
			id: elementBaseInfo.id,
			status: "0"
		})
		newExercise.forEach((elementExercise, indexExercis) => {
			if (i == parseInt(elementExercise.sort)) {
				exerciseStatus[i].status = elementExercise.status;
			}
		})
	}
	// payload.baseInfo.forEach((elementBaseInfo, indexBaseInfo) => {
	// 	exerciseStatus.push({
	// 		id : elementBaseInfo.id,
	// 		status : "0"
	// 	})
	// 	newExercise.forEach((elementExercise, indexExercis) => {

	// 		if(elementBaseInfo.id == elementExercise.exercise_id){
	// 			exerciseStatus[indexBaseInfo].status = elementExercise.status
	// 		}
	// 	});
	// });
	return exerciseStatus;
}

function fileterKnowledge(payload) {
	let knowledgeArray = [];
	let master = [];
	let masterLength = 0;
	let strengthen = [];
	let strengthenLength = 0;
	payload.exerciseStatus.forEach((element) => {
		payload.knowledge.forEach((elementKnowledge) => {
			for (let knowledgeId in elementKnowledge) {
				if (knowledgeId == element.id) {
					if (element.status == "0" || element.status == "2") {
						elementKnowledge[knowledgeId].forEach((element) => {
							knowledgeArray.push({
								state: 0,
								title: element.enTitle,
								id: element.id
							})
						})
					} else if (element.status == "1") {
						elementKnowledge[knowledgeId].forEach((element) => {
							knowledgeArray.push({
								state: 1,
								title: element.enTitle,
								id: element.id
							})
						})
					}
				}
			}

		})
	})
	let knowledge = knowledgeSummary(knowledgeArray);
	return knowledge
}

function knowledgeSummary(knowledge) {
	let knowledgeSummary = [];
	let knowledgeIndex = 0;
	let master = [];
	let masterLength = 0;
	let strengthen = [];
	let strengthenLength = 0;
	knowledge.forEach((element) => {
		let rightNum = 0;
		let errorNum = 0;
		if (element.state) {
			rightNum = 1;
		} else {
			errorNum = 1;
		}
		let addRight = _.find(knowledgeSummary, {
			'id': element.id
		});
		if (addRight) {
			knowledgeSummary[addRight.index].rightNum += rightNum;
			knowledgeSummary[addRight.index].errorNum += errorNum;
		} else {
			knowledgeSummary.push({
				index: knowledgeIndex,
				rightNum: rightNum,
				errorNum: errorNum,
				title: element.title,
				id: element.id
			})
			knowledgeIndex++;
		}
	})
	knowledgeSummary.forEach((element) => {
		let rightNum = element.rightNum;
		let errorNum = element.errorNum;
		if (rightNum && errorNum) {
			let roundNum = (rightNum / (rightNum + errorNum));
			if (roundNum > 0.7) {
				master.push(element)
			} else {
				strengthen.push(element)
			}
		} else if (rightNum) {
			master.push(element)
		} else if (errorNum) {
			strengthen.push(element)
		}
	})
	masterLength = master.length;
	strengthenLength = strengthen.length;
	return {
		summary: {
			total: masterLength + strengthenLength,
			master: masterLength,
			strengthen: strengthenLength
		},
		master: master,
		strengthen: strengthen
	}
}

function fileterKnowledgeBack(payload) {
	let master = [];
	let masterLength = 0;
	let strengthen = [];
	let strengthenLength = 0;
	payload.exerciseStatus.forEach((element) => {
		payload.knowledge.forEach((elementKnowledge) => {
			for (let knowledgeId in elementKnowledge) {
				if (knowledgeId == element.id) {
					if (element.status == "0" || element.status == "2") {
						elementKnowledge[knowledgeId].forEach((element) => {
							strengthen.push({
								state: 0,
								title: element.enTitle,
								id: element.id
							})
						})
					} else if (element.status == "1") {
						elementKnowledge[knowledgeId].forEach((element) => {
							master.push({
								state: 1,
								title: element.enTitle,
								id: element.id
							})
						})
					}
				}
			}

		})
	})
	let newMaster = _.uniqBy(master, 'id');
	let newStrengthen = _.uniqBy(strengthen, 'id');
	let rightMaster = [];
	newMaster.forEach((elementMaster, indexMaster) => {
		let addRight = _.find(newStrengthen, {
			'title': elementMaster.title
		});

		if (!addRight) {
			rightMaster.push(elementMaster)
		}

	})

	masterLength = rightMaster.length;
	strengthenLength = newStrengthen.length;

	return {
		summary: {
			total: masterLength + strengthenLength,
			master: masterLength,
			strengthen: strengthenLength
		},
		master: rightMaster,
		strengthen: newStrengthen
	}
}



function getExerciseSummary(payload) {
	let total = payload.exerciseStatus.length;
	let right = 0;
	let error = 0;
	let time = iGlobal.formatSeconds(payload.exam.total_time, 'h');
	let score = 0;
	let doError = 0;
	let doRight = 0;
	let doNone = 0;
	payload.exerciseStatus.forEach((element, index) => {
		if (element.status == "0") {
			error++;
			doNone++;
		}
		if (element.status == "1") {
			right++;
			doRight++;
		}
		if (element.status == "2") {
			error++;
			doError++;
		}

	})
	score = Math.round((right / total) * 100);
	return {
		total: total,
		error: error,
		right: right,
		score: score,
		time: time,
		doNone: doNone,
		doRight: doRight,
		doError: doError
	}
}

function fileterExercise(payload) {
	let right = '';
	let error = '';
	let score = '';
	let list = [];



	exerciseData = getExerciseData(total, payload.exercise);
	error = exerciseData.errorNum;
	right = total - error;
	score = Math.round((right / total) * 100);
	list = exerciseData.list;
	return {
		title: payload.exam.examen_name,
		total: payload.baseInfo.length,
		error: error,
		right: right,
		score: score,
		list: list
	}
}

function getExerciseData(total, exercise) {
	let newExercise = _.uniqBy(exercise, 'sort');
	let exerciseArray = [];
	let exerciseErrorNum = 0;

	for (let i = 0; i < total; i++) {
		let status = "2";
		let thisExercise = _.find(newExercise, {
			'sort': i.toString()
		});
		if (thisExercise) {
			status = thisExercise.status;
			if (status == "2") {
				exerciseErrorNum++;
			}
		} else {
			exerciseErrorNum++;
		}
		exerciseArray.push({
			"status": status
		})
	}
	return {
		errorNum: exerciseErrorNum,
		list: exerciseArray
	};
}


module.exports = examReport