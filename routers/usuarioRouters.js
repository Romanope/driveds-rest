var express = require('express');
var router = express.Router();
var controllerUsuario = require('.././controllers/controladorUsuario');

router.get('/:usuario', function (req, res) {
    controllerUsuario.consultar(req.params.usuario, function (result){
    	console.log('enviando resultado ' + result);
    	res.status(200).json(result);
    });
});

module.exports = router;