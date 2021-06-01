const express = require("express");
const bodyParser = require('body-parser');
var mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'macos-bigsur',
  password: 'zY3vgrFvbbtiIJ1T',
  database: 'express-example'
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {

 const data = {
  ok: true,
  code: 200,
  message: 'API express example root'
 };

 res.send(data);
});






app.get('/get-users', function (req, res) {

  const getAllUsers = "SELECT * FROM USERS";
  connection.connect();
  connection.query(getAllUsers, function (error, rows, fields) {
    if (error) {
      const data = internalError();
      res.send(data);
    }else{
      if(rows.length){
        const data = dataRetrived(rows);
        res.send(data);
      }else{
        const data = noDataFound();
        res.send(data);
      }
    }

  });
  connection.end();

 

  function internalError(){
    const data = {
      ok: false,
      code: 500,
      message: 'Database error'
    };

    return data;
  }

  function noDataFound() {

    const data = {
      ok: true,
      code: 403,
      message: 'No users in Database',
    };

    return data;

  }

  function dataRetrived(rows){

    const data = {
      ok: true,
      code: 200,
      message: 'Data retrived from Database',
      data: rows
    };

    return data;
  }
});



app.put('/add-user', function (req, res) {

  const id = req.body.id;
  const name = req.body.name;
  const active = req.body.active;
  const mail = req.body.mail;
  const role = req.body.role;

  const insertUser = "INSERT INTO USERS (id, name, active, mail, role) VALUES (?, ?, ?, ?, ?)";
  const values = [id, name, active, mail, role];

  connection.connect();
  connection.query(insertUser, values, function (error, rows, fields) {
    if (error) {

      const data = internalError();
      res.send(data);

    } else {

      const data = dataSaved();
      res.send(data);
    }

  });
  connection.end();

  function internalError() {
    const data = {
      ok: false,
      code: 500,
      message: 'Database error'
    };

    return data;
  }

  function dataSaved() {

    const data = {
      ok: true,
      code: 200,
      message: 'Data was saved to Database',
    };

    return data;
  }

});

app.use(function(req, res, next) {
  
  const data = notFound();

  res.send(data);

 function notFound(){
   const data = {
     ok: false,
     code: 404,
     mensaje: 'Not found'
   };

   return data;
 }
});

app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});