const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRouter = require('./routes/mainRouter'); // Adjust the path as necessary
const itemRouter = require('./routes/itemRouter'); // Adjust the path as necessary

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Main Route
app.use('/', mainRouter);


// Use the item routes
app.use('/items', itemRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});