import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production'; 
const host = isProduction ? process.env.MYSQL_HOST : process.env.MYSQL_PUBLIC_URL; 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: host,  // Use internal or public URL
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the database");
    connection.release();  // Release the connection after use
});

export default pool;
