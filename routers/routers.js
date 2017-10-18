var express = require('express');
var router = express.Router();
var fs = require("fs");
var qs = require('querystring');
var controllerUsuario = require('.././controllers/controladorUsuario');

router.post('/', function (req, res) {
	console.log("arquivo recebido");
	console.log(req.body.length);
	var arquivos = req.body;
	for (var i = 0; i < arquivos.length; i++) {
		writeFile(arquivos[i].usuario, arquivos[i].nome, arquivos[i].conteudo);
	}
	res.status(200).json(req.body);	
});

router.delete('/:nomeArquivo/:usuario', function (req, res) {
	console.log("Apagando arquivo " + req.params.nomeArquivo);
	var path = "D:\\projetos\\faculdade\\2017.2\\sistemas-distribuidos\\arq-recebidos\\"+req.params.usuario+"\\"+req.params.nomeArquivo;
	fs.unlinkSync(path);
	console.log("Arquivo " + req.params.nomeArquivo + " removido com sucesso!");
	res.status(200).json(req.body);	
});

function writeFile(usuario, nome, conteudo) {
	var path = "D:\\projetos\\faculdade\\2017.2\\sistemas-distribuidos\\arq-recebidos\\"+usuario;
	if (!fs.existsSync(path)){
    	fs.mkdirSync(path);
	}	
	path = "D:\\projetos\\faculdade\\2017.2\\sistemas-distribuidos\\arq-recebidos\\"+usuario+"\\"+nome;
	var buff = new Buffer(conteudo, 'base64');
	fs.writeFile(path, buff, 0, buff.length, 0, function(err) {
	    if(err) {
	        console.log(err);
	        return;
	    }

	    console.log(nome + " atualizado com sucesso!");
	});
}

function getListaArquivos(usuario) {
	fs.readdirSync(testFolder).forEach(file => {
	  console.log(file);
	});
}

module.exports = router;