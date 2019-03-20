const fs = require("fs")
const path = require("path")
function readDirSync(path){
  const files = fs.readdirSync(path);  
  files.forEach(function(ele,index){
    const info = fs.statSync(path+"/"+ele)
    if(info.isDirectory()){  
      readDirSync(path+"/"+ele);  
    }else{  
      if(ele != 'config.js'){
      	addMapping(require(path+"/"+ele))
      }
    }     
  })  
}