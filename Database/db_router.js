const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDBConnection() {
    try {
        const db = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER, 
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });
        console.log('Connected to the database (MYSQL)');
        return db;
    } catch (err) {
        //console.error('There was an error connecting to the database:', err);
        throw err;  // Re-throw the error after logging it
    }
}

module.exports = createDBConnection;