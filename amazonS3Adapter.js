var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var bucketName = 'driveds';


var amazonS3Adapter = {

	uploadFile: function (usuario, fileName, bytes, callback) {

		var absoluteName = usuario + '/' + fileName;

		var params = {
				  Body: JSON.stringify(bytes), 
				  Bucket: bucketName, 
				  Key: absoluteName
		 };		
	 	console.log(params);
	 	s3.putObject(params, function(err, data) {
	   		
   			if (err) console.log(err, err.stack); // an error occurred
   			callback(data);
	 	});
	},
	downloadFile: function (usuario, fileName, callback) {
		var arq = usuario + '/' + fileName;
		var params = {
  			Bucket: bucketName, 
	  		Key: arq
	 	};
	 	console.log('consultando arquivo: ' + arq);
	 	s3.getObject(params, function(err, data) {
		   if (err) console.log(err, err.stack); // an error occurred
		   else     console.log(data); 
		   			var file = {
		   				nome: fileName,
		   				usuario: usuario,
		   				data: JSON.parse(JSON.stringify(data.Body)).data
		   			}
		   			callback(file);           
		});
	},
	deleteFile: function (usuario, fileName, callback) {

		var arq = usuario + '/' + fileName;
		console.log("Apagando arquivo " + arq);
		var params = {
			Bucket: bucketName, 
			Key: arq
		}
		s3.deleteObject(params, function(err, data) {
			
			var retorno = true;
			if (err) {
				console.log(err, err.stack);
				retorno = false;
			} 
			callback(retorno);
		});

	}
}

module.exports = amazonS3Adapter;