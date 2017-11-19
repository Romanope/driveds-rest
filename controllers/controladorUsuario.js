var pool = require('.././dataSource');

var controllerUsuario =  {
	inserir: function (usuario, callback) {

		if (!usuario) return;
		console.log(usuario);
		var insert = "insert into `usuario` (`USU_LOGIN`, `USU_SENHA`, `USU_EMAIL`, 'USU_DIRE_ARQUIVO', `USU_DH_CADASTRO`) values (?)";
		var params = [usuario.login, usuario.senha, usuario.email, "diretorio", new Date()];
		
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(insert, [params], function (err, result) {
		    	// And done with the connection.
			    connection.release();

			    // Handle error after the release.
			    if (err) throw err;

			    callback(result);
			});
		});
	}, 
	consultar: function (login, callback) {
		console.log('consultando usuario: ' + login);
		var select = "select usu_id as id, usu_login as login, usu_senha as senha from usuario where usu_login = '" + login + "'";
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(select, function (error, results, fields) {
		    	// And done with the connection.
			    connection.release();
			    // Handle error after the release.
			    if (error) throw error;

			    callback(results[0]);
			});
		});
	},
	consultarArqCompartilhados: function (login, callback) {
		var query = 'select usu.USU_LOGIN as loginProp, comp.FILE_NAME as file, usu2.USU_LOGIN as loginComp from driveds.compartilhamento comp' + 
                    ' inner join driveds.usuario usu on usu.USU_ID = comp.USU_ID_PROP' +
					' inner join driveds.usuario usu2 on usu2.USU_ID = comp.USU_ID_COMP' + 
					' where usu2.USU_LOGIN = ?';
		var params = [login];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(query, params, function (error, results, fields) {
		    	// And done with the connection.
			    connection.release();
			    // Handle error after the release.
			    if (error) throw error;
			    
			    callback(JSON.parse(JSON.stringify(results)));
			});
		});

	},
	consultarArqComparPorArqEUsuario: function (login, fileName, callback) {
		var query = 'select usu.USU_LOGIN as loginProp, comp.FILE_NAME as file, usu2.USU_LOGIN as loginComp from driveds.compartilhamento comp' + 
                    ' inner join driveds.usuario usu on usu.USU_ID = comp.USU_ID_PROP' +
					' inner join driveds.usuario usu2 on usu2.USU_ID = comp.USU_ID_COMP' + 
					' where usu2.USU_LOGIN = ? and comp.FILE_NAME = ?';
		var params = [login, fileName];
		pool.getConnection(function(err, connection) {
	    	// Use the connection
		    connection.query(query, params, function (error, results, fields) {
		    	// And done with the connection.
			    connection.release();
			    // Handle error after the release.
			    if (error) throw error;
			    
			    callback(JSON.parse(JSON.stringify(results)));
			});
		});
	},
}

module.exports = controllerUsuario;