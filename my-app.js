const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// MySQL config
const mySqlHost = getSqlHost();
const mySqlUser = process.env.MYSQLUSER || 'macos-bigsur';
const mySqlPassword = process.env.MYSQLPASSWORD || 'zY3vgrFvbbtiIJ1T';
const mySqlDatabase = process.env.MYSQLDATABASE || 'express-example';

const connection = mysql.createConnection({
  host: mySqlHost,
  user: mySqlUser,
  password: mySqlPassword,
  database: mySqlDatabase
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

  const getAllUsers = "SELECT * FROM USERS";

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

  const insertUser = "INSERT INTO USERS (id, name, active, mail, role) VALUES (?, ?, ?, ?, ?)";
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

  const deleteUser = "DELETE FROM USERS WHERE ID = (?)";
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

  const editUser = "UPDATE USERS SET NAME = (?) , ACTIVE = (?), MAIL = (?), ROLE = (?) WHERE ID = (?)";
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


function getSqlHost(){
  const railwaySqlHost = `${process.env.MYSQLHOST}:${process.env.MYSQLPORT}`;
  const localhost = 'localhost';

  return process.env.MYSQLHOST ? railwaySqlHost : localhost;
}