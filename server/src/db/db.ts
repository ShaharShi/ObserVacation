import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "01478545Ss",
  database: "obser_vacation",
  multipleStatements: true,
});