var pool = require('.././dataSource');

var controladorArquivo =  {
	consultarArquivoNaoSincronizados: function (chaveUsuario, callback, sincronizado) {

		if (!chaveUsuario) return;
		console.log(chaveUsuario);
		var select = 'select ARQ.ARQ_ID as chavePrimaria, ' + 
					  		'ARQ.ARQ_NM as nome, ' +
					  		'ARQ.ARQ_SYN as sincronizado, ' +
					  		'ARQ.ARQ_REMOVIDO as removido, ' +
					  		'0 as compartilhado, ' +
					  		'USU.USU_LOGIN as usuario, ' +
					  		'ARQ.ARQ_TAMANHO as tamanho, ' +
					  		'ARQ.ARQ_DH_ULT_MODIFICACAO as ultimaModificacao ' +
					  		'from ARQUIVO ARQ ' +
					  		'INNER JOIN USUARIO USU ON USU.USU_ID = ARQ.USU_ID WHERE USU.USU_ID = ?';
		
		if (sincronizado) {
			select = select + ' and ARQ.ARQ_SYN = 0';
		}
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(select, [chaveUsuario], function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;

			    callback(JSON.parse(JSON.stringify(result)));
			});
		});
	},
	atualizarSincronizacaoArquivos: function (arquivo) {

		var update = 	'update ARQUIVO as arq1 ' + 
						'INNER JOIN ( ' +
 						'select ARQ.ARQ_ID from ARQUIVO ARQ ' +
 						'INNER JOIN USUARIO USU ON USU.USU_ID = ARQ.USU_ID ' + 
 						'WHERE USU.USU_LOGIN = ? and ARQ.ARQ_NM = ? and ARQ.ARQ_SYN = 0 ' + 
						') as result on result.ARQ_ID = arq1.ARQ_ID ' +
						'SET arq1.arq_syn = 1';

		var params = [arquivo.usuario, arquivo.nome];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(update, params, function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;

			});
		});				
	},
	removerArquivo: function (chaveUsuario, nomeArquivo) {
		var update = 	'update ARQUIVO as arq1 ' + 
						'INNER JOIN ( ' +
 						'select ARQ.ARQ_ID from ARQUIVO ARQ ' +
 						'INNER JOIN USUARIO USU ON USU.USU_ID = ARQ.USU_ID ' + 
 						'WHERE USU.USU_LOGIN = ? and ARQ.ARQ_NM = ? ' + 
						') as result on result.ARQ_ID = arq1.ARQ_ID ' +
						'SET arq1.arq_removido = 1';
		var params = [chaveUsuario, nomeArquivo];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(update, params, function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;
			});
		});		
	},
	consultarArquivoPorUsuario: function (usuario, fileName, callback) {

		var select = 'select ARQ_ID as chavePrimaria from ARQUIVO where USU_ID = ? AND ARQ_NM = ?';
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(select, [usuario, fileName], function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;

			    callback(JSON.parse(JSON.stringify(result)));
			});
		});
	},
	inserirArquivo: function (chaveUsuario, nomeArquivo, tamanho) {
		var insert = 'INSERT INTO ARQUIVO (USU_ID, ARQ_NM, ARQ_SYN, ARQ_REMOVIDO, ARQ_TAMANHO, ARQ_DH_ULT_MODIFICACAO) VALUES (?, ?, 1, 0, ?, ?)';
		var params = [chaveUsuario, nomeArquivo, tamanho, new Date()];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(insert, params, function (err, result) {
		    	// And done with the connection.
			    connection.release();
			    // Handle error after the release.
			    if (err) throw err;
			});
		});	
	},
	updateArquivo: function (chaveUsuario, nomeArquivo, tamanho) {

		var update = 'update ARQUIVO set ARQ_REMOVIDO = 0, ARQ_SYN = 1, ARQ_TAMANHO = ? where USU_ID = ? AND ARQ_NM = ?';
		var params = [tamanho, chaveUsuario, nomeArquivo];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(update, params, function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;
			});
		});	
	}
 }

module.exports = controladorArquivo;