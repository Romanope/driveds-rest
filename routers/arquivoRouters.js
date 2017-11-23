var express = require('express');
var router = express.Router();
var fs = require("fs");
var qs = require('querystring');
var controllerUsuario = require('.././controllers/controladorUsuario');
var controladorDiretorio = require('.././controllers/controladorDiretorio');
var controladorArquivo = require('.././controllers/controladorArquivo');
var path = (process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']) + '/driveds-storage/all-files-users/';
var controladorCompartilhamento = require('.././controllers/controladorCompartilhamento');
var amazonS3Adapter = require('.././amazonS3Adapter');



router.get('/sincronizar/:usuario', function (req, res) {
	
	var usuario = req.params.usuario;
	
	try {
    	controladorArquivo.consultarArquivoNaoSincronizados(usuario, function (arquivosPessoais) {
		
			controladorCompartilhamento.consultarAquivosCompartilhados(usuario, function (arquivosCompartilhamentos) {

				var allFiles;
				if (arquivosPessoais) {
					allFiles = arquivosPessoais.concat(arquivosCompartilhamentos);
				} else {
					allFiles = arquivosCompartilhamentos;
				}

				res.status(200).json(allFiles);
			}, true);
		}, true);
	} catch (e) {
      res.status(500).send(e);
    }
});

router.get('/sincronizacaoInicial/:usuario', function (req, res) {

	var usuario = req.params.usuario;
	
	try {
		controladorArquivo.consultarArquivoNaoSincronizados(usuario, function (arquivosPessoais) {
		
			controladorCompartilhamento.consultarAquivosCompartilhados(usuario, function (arquivosCompartilhamentos) {

				var allFiles = arquivosPessoais.concat(arquivosCompartilhamentos);
				
				res.status(200).json(allFiles);
			}, false);
		}, false);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.post('/obterArquivo', function (req, res) {

	try {
		var usuario = req.body.usuario;
		var fileName = req.body.nome;

		controladorDiretorio.consultarArquivoByusuario(usuario, fileName, function (result) {
			res.status(200).json(result);
		});
	} catch (e) {
 		res.status(500).send(e);
	}
});

router.post('/', function (req, res) {
	
	console.log(req.body.length);
	
	try {
		var arquivos = req.body;
		var arquivo = arquivos[0];
		var tamanho = arquivo.tamanho;
		amazonS3Adapter.uploadFile(arquivo.usuario, arquivo.nome, arquivo.data, function (data) {
			
			controladorArquivo.consultarArquivoPorUsuario(arquivo.usuario, arquivo.nome, function (resultSet) {
				console.log('resultSet: ' + resultSet);
				if (resultSet.length == 0) {
					controladorArquivo.inserirArquivo(arquivo.chaveUsuario, arquivo.nome, tamanho);
				} else if (resultSet.length == 1) {
					controladorArquivo.updateArquivo(resultSet.chavePrimaria);
				}
				console.log('return of the AmazonS3 ' + data);	
				res.status(200).end();	
			});
		});
	} catch (e) {
		res.status(500).send(e);
	}
});

router.post('/atualizarSincronizacaoArquivos', function (req, res) {

	try {
		var arquivos = req.body;
		console.log(arquivos);

		for (var i = 0; i < arquivos.length; i++) {
			if (!arquivos[i].compartilhado) {
				console.log('atualizando flag de sincronização do arquivo PESSOAL ' + arquivos[i].nome);
				controladorArquivo.atualizarSincronizacaoArquivos(arquivos[i]);
			} else {
				console.log('atualizando flag de sincronização do arquivo COMPARTILHADO ' + arquivos[i].nome);
				controladorCompartilhamento.atualizarFlagCompartilhamento(arquivos[i]);
			}
		}

		res.status(200).end();
	} catch (e) {
		res.status(500).send(e);
	}
});


router.delete('/:nomeArquivo/:usuario', function (req, res) {
	
	try {
		var usuario = req.params.usuario;
		var nomeArquivo = req.params.nomeArquivo;
		
		amazonS3Adapter.deleteFile(usuario, nomeArquivo, function (result) {

			if (result) {
				controladorArquivo.removerArquivo(usuario, nomeArquivo);
			}
			res.status(200).send(result);
		});	
	} catch (e) {
		res.status(500).send(e);
	}
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



router.get('/consultarArquivosNaoSincronizados/:usuario', function (req, res) {
	controladorArquivo.consultarArquivoNaoSincronizados(req.params.usuario, function (result) {
		
		console.log('LISTA DE ARQUIVOS NÃO SINCRONIZADOS ' + result);
		var arquivos = [];
		for (var i = 0; i < result.length; i++) {
			var arquivo = {
				nome: result[i].nome,
				removido: result[i].removido,
				sincronizado: result[i].sincronizado
			}
			arquivos.push(arquivo);
		}
		res.status(200).json(arquivos);
	});
});



module.exports = router;