import mysql from 'mysql'

const con = mysql.createConnection({
    host: "mysql.railway.internal",
    user: "root",
    password: "qwpzEAgQvxcZHgiMLAmeDeBrPTusJloJ",
    database: "railway"
})

con.connect(function(err) {
    if(err) {
        console.log("connection error")
    } else {
        console.log("Connected")
    }
})

export default con;

