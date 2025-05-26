import dotenv from "dotenv";
import http from 'http'
dotenv.config({
    path: './.env'
})
import connection from "./db/connection.js";
import app from "./app.js";

// connection.then(()=>{
//     app.listen(process.env.PORT || 8000)
//     console.log("App is listening on port ", process.env.PORT)
// })
// const server = http.createServer(app)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});