// At the top of mainController.js
const db = require('../config/db_mysql');

exports.getGenreData = (req, res) => {
    // Call the stored procedure
    db.query('CALL GetGenreData(1)', (err, result) => {
        if (err) throw err;
        // Render the view with the data
        res.render('genreData', { data: result });
    });
};