var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
/*var pathDefault = "/home/ubuntu/";*/
var pathDefault = (process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']) + '/driveds/all-files-users/';
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
	},
	obterNomeProxArqCompartilhado: function (compartilhamentos, currentFileName) {
		var cont = 0;
		for (var i = 0; i < compartilhamentos.length; i++) {
			console.log('procurando proximo arquivo');
			if (cont == 1) {
				console.log('proximo arquivo encontrado ' + compartilhamentos[i].file);
				return compartilhamentos[i].loginProp + '@' + compartilhamentos[i].file;
			}
			if (compartilhamentos[i].file == currentFileName) {
				cont++;
			}
		}
		return null;
	},
	consultarNomeArquivosParaDownload: function (usuario, nomeArqsLocal, callback) {


		var pathUser = pathDefault + usuario;
		walker = walk.walk(pathUser);
 
 		var filesName = [];
 		walker.on("file", function (root, file, next) {
		    
		    var download = true;
		    if (nomeArqsLocal) {
		    	for (var i = 0; i < nomeArqsLocal.length; i++) {
		    		if (file.name == nomeArqsLocal[i]) {
		    			download = false;
		    		}
		    	}
 			}
			if (download) {
				filesName[filesName.length] = file.name;
			}
		    next();
		});
	  	walker.on("end", function () {
	  		console.log('Arquivos para download do usuario: ' + usuario);
	  		console.log(filesName);
    		callback(filesName);
  		});
	},
	consultarArquivoByusuario: function (usuario, fileName) {
	
		var currentPath = pathDefault + usuario + '/' + fileName;
		var data = fs.readFileSync(absolutePath);
		return {
			nome: nomeArq,
			conteudo: data,
			usuario: usuario
		};
	}
}

module.exports = controladorDiretorio;