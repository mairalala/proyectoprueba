const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Módulo para cifrar contraseñas

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_app'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Registro de nuevos usuarios
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    // Cifrar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send('Error registering user');
        }
        res.status(200).send('User registered successfully');
    });
});

// Autenticación de usuarios
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Obtener el usuario de la base de datos por su dirección de correo electrónico
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    // Verificar la contraseña cifrada con la contraseña proporcionada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid email or password');
    }

    // Si las credenciales son válidas, devolver un mensaje de éxito o un token de sesión
    res.status(200).send('Login successful');
});

// Función para obtener un usuario por su dirección de correo electrónico
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);
        });
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
