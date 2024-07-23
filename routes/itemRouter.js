// routes/itemRoutes.js
const express = require('express');
const itemController = require('../controllers/itemController');

const itemRouter = express.Router();

// load items list
itemRouter.get('/getItems', itemController.getItems);

// Route to process the add form, now returns JSON
itemRouter.post('/add', itemController.addItem);

// Route to process the edit form, now returns JSON
itemRouter.post('/saveItem', itemController.saveItem);

//default
itemRouter.get('/', itemController.itemsPage);

module.exports = itemRouter;