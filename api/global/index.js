module.exports = {
	getDate : function(str,connector){
		if(str == null){
		    return '';
		}
		var timestamp = str.toString();
		if(timestamp.length > 11){
		    timestamp = timestamp.substring(0,10);
		}
    var format = '';
    if(connector && connector == '-'){
      format = 'yyyy-MM-dd'
    }else{
      format = 'yyyy/MM/dd';
    }
		var newDate = new Date(parseInt(timestamp) * 1000);
		var date = {
		    "M+": newDate.getMonth() + 1,
		    "d+": newDate.getDate(),
		    "h+": newDate.getHours(),
		    "m+": newDate.getMinutes(),
		    "s+": newDate.getSeconds(),
		    "q+": Math.floor((newDate.getMonth() + 3) / 3),
		    "S+": newDate.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
		    format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
		    if (new RegExp("(" + k + ")").test(format)) {
		        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(("" + date[k]).length));
		    }
		}
		return format;
	},
	getLocalTime:function (str,connector){
    if(str == null){
        return '';
    }
    var timestamp = str.toString();
    if(timestamp.length > 11){
        timestamp = timestamp.substring(0,10);
    }
    var format = 'yyyy-MM-dd h:m:s';
    var newDate = new Date(parseInt(timestamp) * 1000);
    var date = {
        "M+": newDate.getMonth() + 1,
        "d+": newDate.getDate(),
        "h+": newDate.getHours(),
        "m+": newDate.getMinutes(),
        "s+": newDate.getSeconds(),
        "q+": Math.floor((newDate.getMonth() + 3) / 3),
        "S+": newDate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(("" + date[k]).length));
        }
    }
    var formatArr = format.split(" ");
    var time = formatArr[0]+' ';
    var formatArrs = formatArr[1].split(":");
    for(var i=0;i<formatArrs.length;i++){
        if(i>0){
            time+=':';
        }
        if(formatArrs[i].length == 1){
            time+='0'+formatArrs[i];
        }else{
            time+=formatArrs[i];
        }
    }
    return time;
  },
	timeago : function (data){
    var $_data = parseInt(data);
    var $_return_string = '1分钟前';
    var $_timestamp=parseInt(new Date().getTime()/1000);
    var $_reste = $_timestamp - $_data;
    if($_reste<0){
    	$_reste = 1;
    }
   	if($_reste <3600){
        $_return_string = Math.ceil($_reste/60)+'分钟前';
    }else if($_reste>=3600 && $_reste <(3600*24)){
        $_return_string = Math.ceil($_reste/3600)+'小时前';
    }else if($_reste>=(3600*24) && $_reste <(3600*24*30)){
        $_return_string = Math.ceil($_reste/(3600*24))+'天前';
    }else if($_reste>=(3600*24*30) && $_reste <(3600*24*30*12)){
        $_return_string = Math.ceil($_reste/(3600*24*30))+'月前';
    }else{
        $_return_string = Math.ceil(parseInt($_reste/(3600*24*30*12)))+'年前';
    }
    return $_return_string;
	},
  formatSeconds:function(value,type) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
        }
    }
    var result = "";
    if(type == 'h'){
      if(theTime > 9) {
          result = parseInt(theTime)+"s";
      }else if(theTime > 0) {
          result = "0"+parseInt(theTime)+"s";
      }else{
          result = "0"+"s";
      }
      if(theTime1 > 9) {
          result = parseInt(theTime1)+"m"+result;
      }else if(theTime1 > 0) {
          result = "0"+parseInt(theTime1)+"m"+result;
      }else{
          result = "0"+"m"+result;
      }
      // if(theTime > 0) {
      //     result = parseInt(theTime)+"s"+result;
      // }
      // if(theTime1 > 0) {
      //     result = parseInt(theTime1)+"m"+result;
      // }
      // if(theTime2 > 0) {
      //     result = parseInt(theTime2)+"h"+result;
      // }
      if(theTime2 > 9) {
          result = parseInt(theTime2)+"h"+result;
      }else if(theTime2 > 0) {
          result = parseInt(theTime2)+"h"+result;
      }else{
          result = "0"+"h"+result;
      }
    }else{
      if(theTime > 9) {
          result = parseInt(theTime);
      }else if(theTime > 0) {
          result = "0"+parseInt(theTime);
      }else{
          result = "00";
      }
      if(theTime2>0){
          theTime1=theTime1+theTime2*60;
      }
      if(theTime1 > 9) {
          result = parseInt(theTime1)+":"+result;
      }else if(theTime1 > 0) {
          result = "0"+parseInt(theTime1)+":"+result;
      }else{
          result = "00"+":"+result;
      }
    }
    
    return result;
  },
  formatTimeToDay : function(startTime, endTime, serverTime){
    let time = '0';
    let day = '';
    let dayArray = [];
    let msec = 1000*60*60*24;
    if(serverTime<startTime){
      time = startTime - serverTime;
    }else if(startTime<serverTime && serverTime<endTime){
      time = serverTime - startTime;
    }else if(endTime<serverTime){
      time = serverTime - startTime;
    }
    day = (parseInt(time/msec) +1).toString();
    if(day.length == 1){
      day = "00" + day;
    }else if(day.length == 2){
      day = "0" + day;
    }else if(day.length == 3){

    }else{

    }
    dayArray = day.split('');
    return {
      day : day,
      dayArray : dayArray
    }
  },
	getPercentage : function(payload){
		let percentage = 1;
		let progress = payload.progress ? parseInt(payload.progress) : 0;
		let total = payload.total ? parseInt(payload.total) : 0;
		if(progress && total){
			let a = progress/total;
			if(a>0 && a<0.01){
				a = 0.01
			}
			percentage = parseInt(a*100);
		}
		if(percentage >= 100){
			percentage = 100;
			progress = total;
		}
    
    return {
    	"progress" : progress,
    	"total" : total,
    	"percentage" : percentage
    };
  },
  getProgress : function(progress, total, type){
    var taskprogress = progress ? parseInt(progress) : 0;
    var taskTotal = total ? parseInt(total) : 0;
    var percentage = 0;
    var lastProgress = progress;
    if(taskprogress && taskTotal){
      var a = taskprogress/taskTotal;
      if(a>0 && a<0.01){
        a = 0.01
      }
      percentage = parseInt(a*100);
    }else if(lastProgress){
      percentage = 1;
    }
    var percentageProgress = percentage;
    if(percentage >= 100){
      percentageProgress = 100;
    }
    return percentageProgress;
  },
  entities : function(content){
  	let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
  	let newContent = content.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];});
  	return newContent.replace(/<[^>]+>/g,"").replace(/(^\s+)|(\s+$)/g,"").replace(/(\r)|(\n)|(\t)/g,'');
  },
  toString : (str) => {
  	let newString = "";
  	if(str){
  		if(typeof str == "string"){
  			newString = str;
  		}else if(typeof str == "number"){
  			newString = str.toString();
  		}
  	}
  	return newString;
  }
}