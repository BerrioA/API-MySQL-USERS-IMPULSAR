const express = require('express')
const routes = express.Router()


// Mostrar todos los usuarios
routes.get('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM usuarios', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})

// Agregar un usuario
routes.post('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO usuarios set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)

            res.send('Usuario Registrado!')
        })
    })
})

// Eliminar un usuario
routes.delete('/:idusuario', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('DELETE FROM usuarios WHERE idusuario = ?', [req.params.idusuario], (err, rows) => {
            if (err) return res.send(err);
            res.send('Usuario eliminado con Exito!');
        });
    });
});


routes.put('/:idusuario', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('UPDATE usuarios SET ? WHERE idusuario = ?', [req.body, req.params.idusuario], (err, rows) => {
            if (err) return res.send(err);
            res.send('Usuario actualizado con exito!');
        });
    });
});


module.exports = routes