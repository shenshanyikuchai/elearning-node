const fs = require("fs")
const path = require("path")
function readDirSync(path){
  const files = fs.readdirSync(path);  
  files.forEach(function(ele,index){
    const info = fs.statSync(path+"/"+ele)
    if(info.isDirectory()){  
      // console.log("dir: "+ele)  
      readDirSync(path+"/"+ele);  
    }else{  
      // console.log("file: "+ele)
      if(ele != 'config.js'){
      	addMapping(require(path+"/"+ele))
      }
    }     
  })  
}