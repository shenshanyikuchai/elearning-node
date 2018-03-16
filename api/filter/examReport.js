const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

function examReport(payload){
	let exercise = fileterExercise(payload.userExamStatus,payload.userExerciseStatus);
	let knowledgePoint = "知识点";
	let subjectId = payload.userExamStatus.subject_id;
	let courseId = payload.userExamStatus.course_id;
	let chapterId = payload.userExamStatus.chapter_id;
	let taskId = payload.userExamStatus.task_id;
	
	return {
		examReport : {
			exercise : exercise,
			knowledgePoint : knowledgePoint,
			subjectId : subjectId,
			courseId : courseId,
			chapterId : chapterId,
			taskId : taskId
		}
	};
}

function fileterExercise(exam, exercise){
	let title = '';
	let total = '';
	let right = '';
	let error = '';
	let score = '';
	let list = [];
	if(exam.examen_name){
		title = exam.examen_name;
	}
	if(exam.examen_total_num){
		total = exam.examen_total_num;
	}
	exerciseData = getExerciseData(total, exercise);
	error = exerciseData.errorNum;
	right = total - error;
	score = parseInt((right/total)*100);
	list = exerciseData.list;
	return {
		title : exam.examen_name,
		total : total,
		error : error,
		right : right,
		score : score,
		list : list
	}
}
function getExerciseData(total, exercise){
	let newExercise = _.uniqBy(exercise, 'sort');
	let exerciseArray = [];
	let exerciseErrorNum = 0;

	for(let i=0; i<total; i++){
		let status = "2";
		let thisExercise = _.find(newExercise,{'sort' : i.toString()});
		if(thisExercise){
			status = thisExercise.status;
			if(status == "2"){
				exerciseErrorNum++;
			}
		}else{
			exerciseErrorNum++;
		}
		exerciseArray.push({
			"status" : status
		})
	}
	return {
		errorNum : exerciseErrorNum,
		list : exerciseArray
	};
}

module.exports = examReport