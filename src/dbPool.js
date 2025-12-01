const dbInfo = require("../../../../vp2025config"); // 4 kausta väljaspool
const mysql = require("mysql2/promise");


// Loome DB ühenduste kogumi - "pool"
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

/* const pool = mysql.createPool({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
*/