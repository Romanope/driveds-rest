var express = require('express');
var router = express.Router();
var fs = require("fs");
var qs = require('querystring');
var controllerUsuario = require('.././controllers/controladorUsuario');
var controladorDiretorio = require('.././controllers/controladorDiretorio');
var path = (process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']) + '/driveds/all-files-users/';
/*var path = "D:/projetos/faculdade/2017.2/sistemas-distribuidos/arq-recebidos/";*/

router.post('/', function (req, res) {
	console.log("arquivo recebido");
	console.log(req.body.length);
	var arquivos = req.body;
	for (var i = 0; i < arquivos.length; i++) {
		writeFile(arquivos[i].usuario, arquivos[i].nome, arquivos[i].data);
	}
	res.status(200).json(req.body);	
});

router.delete('/:nomeArquivo/:usuario', function (req, res) {
	console.log("Apagando arquivo " + req.params.nomeArquivo);
	var currentPath = path + req.params.usuario + "/" + req.params.nomeArquivo;
	fs.unlinkSync(currentPath);
	console.log("Arquivo " + req.params.nomeArquivo + " removido com sucesso!");
	res.status(200).json(req.body);	
});

function writeFile(usuario, nome, data) {
	var currentPath = path + usuario;
	if (!fs.existsSync(currentPath)){
    	fs.mkdirSync(currentPath);
	}	
	currentPath = path + usuario + "/" + nome;

	var buff = new Buffer(data, 'base64');
	fs.writeFile(currentPath, buff, 0, buff.length, 0, function(err) {
	    if(err) {
	        console.log(err);
	        return;
	    }
	    console.log(nome + " atualizado com sucesso!");
	});
}

var readFile = function (absolutePath, list, usuario, fileName, callback, limiar) {
	fs.readFile(absolutePath, function (data) {
		var file = {
			nome: fileName,
			conteudo: data,
			usuario: usuario
		};
		console.log('adicionando arquivo ' + file.nome);
		list.push(file);
		if (limiar == list.length) {
			callback(list);
		}
	});
}

var consultarArquivoCompartilhados = function (login, list, callback) {
	console.log('iniciando consulta dos arquivos compartilhados com o usuario ' + login)
	controllerUsuario.consultarArqCompartilhados(login, function (data) {
		
		var sizeList = data.length + list.length;
		console.log('limite ' + sizeList);
		for (var i = 0; i < data.length; i++) {
			console.log('limite2');
			var comp = data[i];
			
			console.log('index ' + i + ':');
			console.log(comp);
			
			var loginProp = comp.loginProp;
			var fileName = comp.file;
			
			var absolutePath = path + loginProp + '/' + fileName;
			console.log('path: ' + absolutePath);
			
			readFile(absolutePath, list, loginProp, fileName, callback, sizeList);
		}
		console.log('finalizou o for');
	});
}

router.get('/:usuario', function (req, res) {
	var usuario = req.params.usuario;
	console.log('listando todos os arquivos do usuário ' + usuario);
	var files = [];
	var currentPath = path + usuario;
	
	var absolutePath;
	fs.readdirSync(currentPath).forEach(nomeArq => {
		absolutePath = currentPath + "/" + nomeArq;
		var data = fs.readFileSync(absolutePath);
		var file = {
			nome: nomeArq,
			conteudo: data,
			usuario: usuario
		};

		files.push(file);
	});

	res.status(200).json(files);	
	/*consultarArquivoCompartilhados(usuario, files, function (list) {
		res.status(200).json(list);	
	});*/
});

router.get('/sincronizar/:usuario/:fileName', function (req, res) {
	console.log('consultando arquivo '+ req.params.fileName + ' do usuário ' + req.params.usuario);

	if (req.params.fileName.indexOf('@') != -1) {
		var absolutePath = path + req.params.fileName.replace('@', '/');
		console.log('diretorio do arquivo compartilhado ' + absolutePath);
		fs.readFile(absolutePath, function (data) { 
			console.log('bytes do arquivo lido: ');
			console.log(data);
			var file = {
				data: data,
				nome: req.params.fileName.substring(req.params.fileName.indexOf('@') + 1)
			}
			controllerUsuario.consultarArqCompartilhados(req.params.usuario, function (compartilhamentos) {
				var nameNextFile = controladorDiretorio.obterNomeProxArqCompartilhado(compartilhamentos, file.nome);
				file.nextFile = nameNextFile;
				res.status(200).json(file).end();
			});
		});

	} else {
		controladorDiretorio.listAllFiles(req.params.usuario, req.params.fileName, function (result, nextFile) {
			if (result) {
				if (nextFile) {
					result.nextFile = nextFile;
					console.log('retornando arquivo ' + result.nome);
					res.status(200).json(result).end();	
				} else {
					/*console.log('iniciando consulta de arquivos compartilhados');
					controllerUsuario.consultarArqCompartilhados(req.params.usuario, function (compartilhamentos) {
						console.log('resultado da consulta: ');
						console.log(compartilhamentos);
						if (compartilhamentos) {
							result.nextFile = compartilhamentos[0].loginProp + '@' + compartilhamentos[0].file;
							console.log('retornando arquivo ' + result.nome);
							res.status(200).json(result).end();
						} 
					});*/
					res.status(200).json(result).end();
				}
			} else {
				result = {
					emptyDirectory: true
				}
				console.log('retornando arquivo ' + result.nome);
				res.status(200).json(result).end();	
			}
		});	
	}
	
});

router.post('/listFilesToDownload', function (req, res) {
	
	var lista = req.body;

	console.log(lista.usuario);

	console.log(lista.nomeArquivos);
	
	controladorDiretorio.consultarNomeArquivosParaDownload(lista.usuario, lista.nomeArquivos, function (fileNames) {
		var file = {
			usuario: lista.usuario,
			nomeArquivos: fileNames
		}
		res.status(200).json(file);
	});
});

router.post('/obterArquivo', function (req, res) {

	var usuario = req.body.usuario;
	var fileName = req.body.nome;

	var file = controladorDiretorio.consultarArquivoByusuario(usuario, fileName);

	res.status(200).json(file);

});

module.exports = router;