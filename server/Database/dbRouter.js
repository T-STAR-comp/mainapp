const mysql = require('mysql2/promise');
require('dotenv').config();

const CreateDBConnection = async ()=>{
    try{
        const db = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER, 
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.PORT
        });
        console.log('db connected');
        return db;
    }
    catch(err){
        console.log('db null');
        throw err;
    }
};

module.exports = CreateDBConnection;