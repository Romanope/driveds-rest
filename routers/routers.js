var express = require('express');
var router = express.Router();
var fs = require("fs");
var qs = require('querystring');
var controllerUsuario = require('.././controllers/controladorUsuario');
var controladorDiretorio = require('.././controllers/controladorDiretorio');
var path = "D:\\projetos\\faculdade\\2017.2\\sistemas-distribuidos\\arq-recebidos\\";

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
	var currentPath = path + req.params.usuario + "\\" + req.params.nomeArquivo;
	fs.unlinkSync(currentPath);
	console.log("Arquivo " + req.params.nomeArquivo + " removido com sucesso!");
	res.status(200).json(req.body);	
});

function writeFile(usuario, nome, data) {
	var currentPath = path + usuario;
	if (!fs.existsSync(currentPath)){
    	fs.mkdirSync(currentPath);
	}	
	currentPath = path + usuario + "\\" + nome;

	var buff = new Buffer(data, 'base64');
	fs.writeFile(currentPath, buff, 0, buff.length, 0, function(err) {
	    if(err) {
	        console.log(err);
	        return;
	    }

	    console.log(nome + " atualizado com sucesso!");
	});
}

router.get('/:usuario', function (req, res) {
	console.log('listando todos os arquivos do usuário ' + req.params.usuario);
	var files = [];
	var currentPath = path + req.params.usuario;
	
	var absolutePath;
	fs.readdirSync(currentPath).forEach(nomeArq => {
		absolutePath = currentPath + "\\" + nomeArq;
		var data = fs.readFileSync(absolutePath);
		var file = {
			nome: nomeArq,
			conteudo: data
		};

		files.push(file);

	});

	res.status(200).json(files);
});

router.get('/sincronizar/:usuario/:fileName', function (req, res) {
	console.log('consultando arquivo '+ req.params.fileName + ' do usuário ' + req.params.usuario);
	controladorDiretorio.listAllFiles(req.params.usuario, req.params.fileName, function (result, nextFile) {
		if (result) {
			result.nextFile = nextFile;
			result.emptyDirectory = false;
		} else {
			result = {
				emptyDirectory: true
			}
		}
		console.log('retornando arquivo ' + result.nome);
		res.status(200).json(result).end();
	});
});

module.exports = router;