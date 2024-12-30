import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'qwpzEAgQvxcZHgiMLAmeDeBrPTusJloJ',
    database: 'railway',
    port: 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the database");
    connection.release();  
});

export default pool;
