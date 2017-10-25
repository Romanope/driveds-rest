var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var pathDefault = "/home/ubuntu/";
var walk = require("walk");

var controladorDiretorio = {
	listAllFiles: function (usuario, fileName, callback) {

		var pathUser = pathDefault + usuario;

		if (!fs.existsSync(pathUser)){
    		fs.mkdirSync(pathUser);
		}

		walker = walk.walk(pathUser);
 
 		var file;
 		var nextFile;
 		var fileSearched = fileName;

 		walker.on("file", function (root, fileStats, next) {
		    
 			if (fileSearched == 'first') {
 				fileSearched = fileStats.name;
 			}

		    var data = fs.readFileSync(pathUser + "/" + fileStats.name);
		    data = JSON.parse(JSON.stringify(data));
		    
		    if (file && (!nextFile)) {
				nextFile = fileStats.name;							    	
		    }

		    if (fileSearched == fileStats.name) {
		    	data.nome = fileStats.name;
			    delete data.type;
			    file = data;
		    }
	    	
		    next();
		});
	  	walker.on("end", function () {
    		callback(file, nextFile);
  		});
	},
	generateHashMD5: function (data) {
		if (!data) return null;
		console.log('valor calculado: ' + crypto.createHash('md5').update(data).digest("hex"));
	}
}

module.exports = controladorDiretorio;