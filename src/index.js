const express = require('express');
const mysql = require('mysql2');
const routes = require('./route/route');

const app = express();

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: 'Arjun@#19927498928425',
    database: 'online_examination'
  }) 
  connection.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('Hello ! My self mysql db, I am also connected and running with server.');
  });

  // Middleware to log requests for Postman collection
  // app.use((req, res, next) => {
  //   console.log(`Received ${req.method} request to ${req.originalUrl}`);
  //   console.log('Request body:', req.body);
  //   next();
  // });

  app.use((req, _res, next) =>{
  req.con= connection
  next();
  });

  app.use('/', routes);


  const port = process.env.PORT || 4000; 
  app.listen(port, () =>{
    console.log(`Hello ! Myself local server, and I am running at http://localhost:${port}`);
  });