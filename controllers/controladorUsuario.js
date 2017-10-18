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
	}
}

module.exports = controllerUsuario;