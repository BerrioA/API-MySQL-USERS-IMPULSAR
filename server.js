const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');

const app = express();
app.set('port', process.env.PORT || 9000);

const dbOptions = {
  host: 'bh6qoxspyjypzkmv8z3g-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'uwahfs50c2s2q9qf',
  password: 'BoelubZ0yxNAW1SJFS5f',
  database: 'bh6qoxspyjypzkmv8z3g',
};

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://impulsarth.netlify.app'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(myconn(mysql, dbOptions, 'single'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });

    conn.query('SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?', [correo, contrasena], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Error en la consulta a la base de datos' });
      if (rows.length > 0) {
        req.session.user = rows[0];
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Correo o contraseña incorrectos' });
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

// Server running
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto', app.get('port'));
});
