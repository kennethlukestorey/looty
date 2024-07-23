const neo4j = require('neo4j-driver');

const db = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic('username', 'password')
);
const session = driver.session();

module.exports = db;