import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
console.log('sss');

const isProduction = process.env.NODE_ENV === 'production'; 

const host = isProduction ? process.env.MYSQL_HOST : process.env.MYSQL_PUBLIC_URL;
console.log(host);

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'roundhouse.proxy.rlwy.net',  
    user: 'root',
    password: 'BSwrdhaoxyajrWXRuTqmGrajFafHUKur',
    database: 'railway',
    port: 27067
});
console.log(pool);

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the database");
    connection.release(); 
});

export default pool;
