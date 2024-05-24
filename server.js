const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto a tu usuario de MySQL
    password: '', // Cambia esto a tu contraseña de MySQL
    database: 'restaurant_reservations'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.post('/reservations', (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;
    const sql = 'INSERT INTO reservations (name, email, phone, date, time, guests) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, date, time, guests], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send({ id: result.insertId });
    });
});

app.get('/reservations', (req, res) => {
    const sql = 'SELECT * FROM reservations';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
