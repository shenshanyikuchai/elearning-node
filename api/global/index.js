
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
	getPercentage : function(payload){
		let percentage = 0;
		let progress = payload.progress ? parseInt(payload.progress) : 0;
		let total = payload.total ? parseInt(payload.total) : 0;
		
		if(progress && total){
			let a = progress/total;
			if(a>0 && a<0.01){
				a = 0.01
			}
			percentage = parseInt(a*100);
		}else if(payload.lastProgress){
			percentage = 1;
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
  }
}