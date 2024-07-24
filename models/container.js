// models/Container.js
const db = require('../config/db_mysql'); // Adjust the path as necessary

class Container {
  
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM containers', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }




}
module.exports = Container;