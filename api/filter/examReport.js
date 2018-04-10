const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

function examReport(payload){
	console.log(payload)
	payload.exerciseStatus = getExerciseBaseInfo(payload);
	payload.knowledge = fileterKnowledge(payload);
	payload.exerciseSummary = getExerciseSummary(payload);

	return {
		examReport : {
			status : payload.exerciseStatus,
			knowledge : payload.knowledge,
			summary : payload.exerciseSummary,
			title : payload.exam.examen_name,
			subjectId : payload.exam.subject_id,
			courseId : payload.exam.course_id,
			chapterId : payload.exam.chapter_id,
			taskId : payload.exam.task_id
		}
	};
}
function getExerciseBaseInfo(payload){
	// 根据试题id去重
	let newExercise = _.uniqBy(payload.exercise, 'exercise_id');
	let exerciseStatus = [];
	payload.baseInfo.forEach((elementBaseInfo, indexBaseInfo) => {
		exerciseStatus.push({
			id : elementBaseInfo.id,
			status : "0"
		})
		newExercise.forEach((elementExercise, indexExercis) => {
			if(elementBaseInfo.id && elementExercise.exercise_id){
				exerciseStatus[indexBaseInfo].status = elementExercise.status
			}
		});
	});
	return exerciseStatus;
}
function fileterKnowledge(payload){
	let master = [];
	let masterLength = 0;
	let strengthen = [];
	let strengthenLength = 0;

	payload.exerciseStatus.forEach((element) => {
		payload.knowledge.forEach((elementKnowledge) => {
			for(let knowledgeId in elementKnowledge){
				if(knowledgeId == element.id){
					if(element.status == "0" || element.status == "2"){
						elementKnowledge[knowledgeId].forEach((element) => {
							strengthen.push({
								title : element.enTitle,
								id : element.id
							})
						})
					}else if(element.status == "1"){
						elementKnowledge[knowledgeId].forEach((element) => {
							master.push({
								title : element.enTitle,
								id : element.id
							})
						})
					}
				}
			}
			
		})
	})
	masterLength = master.length;
	strengthenLength = strengthen.length;

	return {
		summary : {
			total : masterLength + strengthenLength,
			master : masterLength,
			strengthen : strengthenLength
		},
		master : master,
		strengthen : strengthen
	}
}

function fileterExercise(payload){
	let right = '';
	let error = '';
	let score = '';
	let list = [];
	

	
	exerciseData = getExerciseData(total, payload.exercise);
	error = exerciseData.errorNum;
	right = total - error;
	score = parseInt((right/total)*100);
	list = exerciseData.list;
	return {
		title : payload.exam.examen_name,
		total : payload.baseInfo.length,
		error : error,
		right : right,
		score : score,
		list : list
	}
}
function getExerciseSummary(payload){
	console.log(payload)
	let total = payload.exerciseStatus.length;
	let right = 0;
	let error = 0;
	let time = iGlobal.formatSeconds(payload.exam.total_time,'h');
	let score = 0;
	payload.exerciseStatus.forEach((element, index) => {
		if(element.status == "0" || element.status == "2"){
			error++;
		}else{
			right++;
		}
	})
	score = parseInt((right/total)*100);
	return {
		total : total,
		error : error,
		right : right,
		score : score,
		time : time
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