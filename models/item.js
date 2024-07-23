// models/Item.js
const db = require('../config/db_mysql'); // Adjust the path as necessary

class Item {
  
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM items', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async create(itemData) {
    return new Promise((resolve, reject) => {
      console.log("Arguments passed to create:", itemData); // Debugging line
      const query = 'INSERT INTO items (name, details) VALUES (?, ?)';
      db.query(query, [itemData.name, itemData.details], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findByIdAndUpdate(itemId, updateData) {
    return new Promise((resolve, reject) => {
      // Construct the SQL query to update the item
      let query = 'UPDATE items SET ';
      const queryParams = [];
      Object.keys(updateData).forEach((key, index, array) => {
        query += `${key} = ?`;
        queryParams.push(updateData[key]);
        if (index < array.length - 1) query += ', ';
      });
      query += ' WHERE id = ?';
      queryParams.push(itemId);

      console.log("updating item: ", itemId)

  
      // Execute the query
      db.query(query, queryParams, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
        console.log(query,queryParams)
      });
    });
  }
}

module.exports = Item;