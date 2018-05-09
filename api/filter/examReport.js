const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

function examReport(payload){
	payload.exerciseStatus = getExerciseBaseInfo(payload);
	payload.knowledges = fileterKnowledge(payload);
	payload.exerciseSummary = getExerciseSummary(payload);

	return {
		examReport : {
			status : payload.exerciseStatus,
			knowledge : payload.knowledges,
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
	// 根据题号判断试题状态
	let exerciseStatus = [];
	for(let i=0;i<+payload.exam.examen_total_num;i++){
		let elementData = '';
		for(let j=0;j<payload.exercise.length;j++){
			if(i == payload.exercise[j].sort){
				elementData = payload.exercise[j];
				break;
			}
		}
		if(elementData){
			if(parseInt(elementData.status) == 1){
				exerciseStatus.push({
					status : "1"
				})
			}else if(parseInt(elementData.status) == 2){
				exerciseStatus.push({
					status : "2"
				})
			}
		}else{
			exerciseStatus.push({
				status : "0"
			})
		}
		
	}
	// 根据试题id去重
	// let newExercise = _.uniqBy(payload.exercise, 'exercise_id');
	
	// payload.baseInfo.forEach((elementBaseInfo, indexBaseInfo) => {
	// 	exerciseStatus.push({
	// 		id : elementBaseInfo.id,
	// 		status : "0"
	// 	})
	// 	_.each(data, function(element, index){
	// 		if(i == element.sort){
	// 			elementData = element;
	// 		}
	// 	})
	// 	newExercise.forEach((elementExercise, indexExercis) => {
	// 		if(elementBaseInfo.id == elementExercise.exercise_id){
	// 			exerciseStatus[indexBaseInfo].status = elementExercise.status
	// 		}
	// 	});
	// });
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
	let newMaster = _.uniqBy(master, 'id');
	let newStrengthen = _.uniqBy(strengthen, 'id');
	let rightMaster = [];
	newMaster.forEach((elementMaster, indexMaster) => {
		let addRight = false;
		if(!_.find(newStrengthen,elementMaster)){
			rightMaster.push(elementMaster)
		}
		// try{
		// 	newStrengthen.forEach((elementStrengthen, indexStrengthen) => {
		// 		if(elementStrengthen.id !== elementMaster.id){
		// 			addRight = true;
		// 			foreach.break=new Error("StopIteration");
		// 		}
		// 	})
		// }catch(e){  
		// 	if(e.message==="foreach is not defined") {  
		// 		return;  
		// 	}else{
		// 		throw e;
		// 	}  
  //   }
		
		// if(addRight){
		// 	rightMaster.push(elementMaster)
		// }
		
	})
	

	masterLength = rightMaster.length;
	strengthenLength = newStrengthen.length;

	return {
		summary : {
			total : masterLength + strengthenLength,
			master : masterLength,
			strengthen : strengthenLength
		},
		master : rightMaster,
		strengthen : newStrengthen
	}
}
function getExerciseSummary(payload){
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