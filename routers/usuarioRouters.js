var express = require('express');
var router = express.Router();
var controllerUsuario = require('.././controllers/controladorUsuario');

router.get('/:usuario', function (req, res) {
    controllerUsuario.consultar(req.params.usuario, function (result){
    	console.log('enviando resultado ' + result);
    	res.status(200).json(result);
    });
});

router.get('/book/photos', function (req, res) {
    
    var photos = [
        {
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
        {
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        },
		{
          url: 'https://cdn-images-1.medium.com/max/1200/1*ArtyUZ73clgqqSoASy6I2A.png',
          alt: 'Leão'
        }
      ]

    res.status(200).json(photos);
});

module.exports = router;