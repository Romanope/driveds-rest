var pool = require('.././dataSource');

var controladorCompartilhamento =  {
	consultarAquivosCompartilhados: function (chaveUsuario, callback, sincronizado) {

		if (!chaveUsuario) return;
		console.log(chaveUsuario);
		var select = 'select arq.arq_id as chavePrimaria, arq.arq_nm as nome, comp.comp_syn as sincronizado, comp.comp_ativo as ativo, 1 as compartilhado, usu_dono.usu_login as usuario, usu_comp.usu_login as usuarioCompartilhamento  from compartilhamento comp ' +
					 'inner join usuario usu_comp on usu_comp.usu_id = comp.usu_id_comp ' +
					 'inner join usuario usu_dono on usu_dono.usu_id = comp.usu_id_prop  ' +
					 'inner join arquivo arq on arq.arq_id = comp.arq_id ' +
					 'where usu_comp.usu_id = ? ';

		if (sincronizado) {
			select = select + ' and comp.comp_syn = 0 ';
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
	atualizarFlagCompartilhamento: function (arquivo) {
		
 		var update = 	'update COMPARTILHAMENTO as COMP ' + 
						'INNER JOIN ( ' +
 						'select comp2.COMP_ID from COMPARTILHAMENTO comp2  ' +
 						'INNER JOIN USUARIO USU ON USU.USU_ID = comp2.USU_ID_COMP ' + 
 						'WHERE USU.USU_LOGIN = ? and comp2.ARQ_ID = ? and comp2.COMP_SYN = 0 ' + 
						') as result on result.COMP_ID = COMP.COMP_ID ' +
						'SET COMP.COMP_SYN = 1';
						console.log('executando update: ' +update);
		var params = [arquivo.usuarioCompartilhamento, arquivo.chavePrimaria];
		console.log('params: ' + params);
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

module.exports = controladorCompartilhamento;