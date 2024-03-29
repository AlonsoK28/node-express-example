const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
require("dotenv").config();

// app config
const port = process.env.PORT || 3000;

// MySQL config
const mySqlHost = process.env.MYSQLHOST;
const mySqlUser = process.env.MYSQLUSER;
const mySqlPassword = process.env.MYSQLPASSWORD;
const mySqlDatabase = process.env.MYSQLDATABASE;
const mySqlPort = process.env.MYSQLPORT;

const connection = mysql.createConnection({
  host: mySqlHost,
  user: mySqlUser,
  password: mySqlPassword,
  database: mySqlDatabase,
  port: mySqlPort
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res) {

 const data = {
  ok: true,
  code: 200,
  message: 'API express example root'
 };

 res.send(data);
});


app.get('/get-users', function (req, res) {

  const getAllUsers = "SELECT * FROM users";

  if (!connection._connectCalled) {
    connection.connect();
  }


  connection.query(getAllUsers, function (error, rows, fields) {
    if (error) {
      console.log({error})
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

  const insertUser = "INSERT INTO users (id, name, active, mail, role) VALUES (?, ?, ?, ?, ?)";
  const values = [id, name, active, mail, role];

  if (!connection._connectCalled) {
    connection.connect();
  }

  connection.query(insertUser, values, function (error, rows, fields) {
    if (error) {

      const data = internalError();
      res.send(data);

    } else {

      const data = dataSaved();
      res.send(data);
    }

  });

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




app.delete('/delete-user/:id', function (req, res) {

  const id = req.params.id;

  const deleteUser = "DELETE FROM users WHERE ID = (?)";
  const value = [id];

  if (!connection._connectCalled) {
    connection.connect();
  }

  connection.query(deleteUser, value, function (error, rows, fields) {
    if (error) {

      const data = internalError();
      res.send(data);

    } else {

      const data = dataDeleted();
      res.send(data);
      
    }

  });

  function internalError() {
    const data = {
      ok: false,
      code: 500,
      message: 'Database error'
    };

    return data;
  }

  function dataDeleted() {

    const data = {
      ok: true,
      code: 200,
      message: 'User was deleted from Database',
    };

    return data;
  }

});



app.post('/edit-user', function (req, res) {

  const id = req.body.id;
  const name = req.body.name;
  const active = req.body.active;
  const mail = req.body.mail;
  const role = req.body.role;

  const editUser = "UPDATE users SET NAME = (?) , ACTIVE = (?), MAIL = (?), ROLE = (?) WHERE ID = (?)";
  const values = [name, active, mail, role, id];

  if (!connection._connectCalled) {
    connection.connect();
  }

  connection.query(editUser, values, function (error, rows, fields) {
    if (error) {

      const data = internalError();
      res.send(data);

    } else {

      const data = editedDeleted();
      res.send(data);
      
    }

  });

  function internalError() {
    const data = {
      ok: false,
      code: 500,
      message: 'Database error'
    };

    return data;
  }

  function editedDeleted() {

    const data = {
      ok: true,
      code: 200,
      message: 'User was edit in Database',
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