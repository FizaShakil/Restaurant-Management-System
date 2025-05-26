import mysql2 from 'mysql2/promise';

let connection;

try {
  connection = await mysql2.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("MySQL Database Connected! DB Host:", process.env.DB_HOST);
} catch (err) {
  console.error("MySQL Connection failed:", err);
}

export default connection;
