const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const routes = require('./routes');

const app = express();
app.set('port', process.env.PORT || 9000);
const dbOptions = {
  host: 'b87j0ttgbimt1yoh1uzm-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'uqumyc5ht2wkpfe3',
  password: 'TWeDJNZfuD6j75Zpbu3j',
  database: 'b87j0ttgbimt1yoh1uzm',
};

// Middlewares
app.use(myconn(mysql, dbOptions, 'single'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query('SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?', [correo, contrasena], (err, rows) => {
      if (err) return res.send(err);
      if (rows.length > 0) {
        req.session.user = rows[0];
        res.redirect('/dashboard');
      } else {
        res.send('Correo o contraseña incorrectos');
      }
    });
  });
});

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});

app.use('/api/usuarios', routes);

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Server running
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto', app.get('port'));
});

