const express = require('express');
const router = express.Router();
const genreController = require('../controllers/mainController');

router.get('/', genreController.getGenreData);

module.exports = router;